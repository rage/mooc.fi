// import { PrismaClient } from "@prisma/client"
import axios from "axios"
import { getAccessToken } from "../services/tmc_completion_script"
import { notEmpty } from "../util/notEmpty"
import sentryLogger from "./lib/logger"
import type { PrismaClient } from "@prisma/client"
import { TMCError } from "./lib/errors"
import { groupBy, orderBy } from "lodash"

const URL = `${
  process.env.TMC_HOST || ""
}/api/v8/users/recently_changed_user_details`

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
  let prisma: PrismaClient | undefined

  if (!_prisma) {
    prisma = (await import("./lib/prisma")).default
  } else {
    prisma = _prisma
  }
  if (!prisma) {
    throw new Error("couldn't get a Prisma instance")
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

  const deletedUsers = await deleteUsers(res, prisma)
  const updatedUsers = await updateEmails(res, prisma)

  const stopTime = new Date().getTime()
  logger.info(`used ${stopTime - startTime} milliseconds`)

  return {
    deletedUsers,
    updatedUsers,
  }
}

export const deleteUsers = async (changes: Change[], prisma: PrismaClient) => {
  const deletedUsers = changes
    .filter((user) => user.change_type === "deleted" && user.new_value === "t")
    .map((user) => user.username)
    .filter(notEmpty)

  logger.info(`found ${deletedUsers.length} deleted users in TMC`)
  const deleted = await prisma.user.deleteMany({
    where: { username: { in: deletedUsers } },
  })

  logger.info(`deleted ${deleted.count} users from database`)

  return deleted.count
}

export const updateEmails = async (changes: Change[], prisma: PrismaClient) => {
  const emailChanges = changes.filter(
    (user) => user.change_type === "email_changed" && user.username !== null,
  )

  const changedEmailUsers = groupBy(
    orderBy(emailChanges, "updated_at", "desc"),
    "username",
  )

  logger.info(
    `found ${emailChanges.length} email updates and ${
      Object.keys(changedEmailUsers).length
    } unique users with changed email`,
  )

  let counter = 0
  for (const [username, changes] of Object.entries(changedEmailUsers)) {
    const newestChange = changes[0]

    try {
      const existing = await prisma.user.findFirst({
        where: { username },
      })

      if (!!existing && existing.email !== newestChange.new_value) {
        await prisma!.user.update({
          where: {
            username,
          },
          data: {
            email: { set: newestChange.new_value },
          },
        })
        counter++
      }
    } catch {}
  }

  logger.info(`updated ${counter} user emails`)

  return counter
}

if (process.env.NODE_ENV !== "test") {
  syncTMCUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error)
      process.exit(1)
    })
}
