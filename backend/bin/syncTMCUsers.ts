// import { PrismaClient } from "@prisma/client"
import axios from "axios"
import { getAccessToken } from "../services/tmc_completion_script"
import { notEmpty } from "../util/notEmpty"
import sentryLogger from "./lib/logger"
import type { PrismaClient } from "@prisma/client"
import { TMCError } from "./lib/errors"

const URL = "https://tmc.mooc.fi/api/v8/users/recently_changed_user_details"

export interface Change {
  id: number
  change_type: "email_changed" | "deleted"
  old_value: string
  new_value: string
  created_at: string
  updated_at: string
  username: string | null
  email: string | null
}

const logger = sentryLogger({ service: "sync-tmc-users" })

export const syncTMCUsers = async (_prisma?: PrismaClient) => {
  let prisma: PrismaClient | undefined = _prisma
  if (!_prisma) {
    prisma = (await import("./lib/prisma")).default
  }

  const startTime = new Date().getTime()

  const accessToken = await getAccessToken()
  const res = await axios
    .get(URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => res.data.changes as Array<Change>)
    .catch(({ response }) => {
      throw new TMCError("Error syncing TMC users", response.data.error)
    })

  const deletedUsers = res
    .filter((user) => user.change_type === "deleted" && user.new_value === "t")
    .map((user) => user.username)
    .filter(notEmpty)

  logger.info(`found ${deletedUsers.length} deleted users in TMC`)
  const deleted = await prisma!.user.deleteMany({
    where: { username: { in: deletedUsers } },
  })

  logger.info(`deleted ${deleted.count} users from database`)
  const stopTime = new Date().getTime()
  logger.info(`used ${stopTime - startTime} milliseconds`)
}

if (process.env.NODE_ENV !== "test") {
  syncTMCUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error)
      process.exit(1)
    })
}
