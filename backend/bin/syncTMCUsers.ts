import axios from "axios"
import { groupBy, orderBy } from "lodash"
import * as winston from "winston"

import { isTest, TMC_HOST } from "../config"
import { TMCError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import { type ExtendedPrismaClient } from "../prisma"
import { getAccessToken } from "../services/tmc"
import { notEmpty } from "../util/notEmpty"

const URL = `${TMC_HOST ?? ""}/api/v8/users/recently_changed_user_details`

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

const _logger = sentryLogger({ service: "sync-tmc-users" })

export interface SyncTMCUsersContext {
  prisma: ExtendedPrismaClient
  logger: winston.Logger
}

export const syncTMCUsers = async (
  ctx: SyncTMCUsersContext = {
    logger: _logger,
  } as SyncTMCUsersContext,
) => {
  const { logger } = ctx

  if (!ctx.prisma) {
    ctx.prisma = (await import("../prisma")).default
  }
  if (!ctx.prisma) {
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

  const deletedUsers = await deleteUsers(res, ctx)
  const updatedUsers = await updateEmails(res, ctx)

  const stopTime = new Date().getTime()
  logger.info(`used ${stopTime - startTime} milliseconds`)

  await ctx.prisma.$disconnect()

  return {
    deletedUsers,
    updatedUsers,
  }
}

export const deleteUsers = async (
  changes: Change[],
  { prisma, logger }: SyncTMCUsersContext,
) => {
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

export const updateEmails = async (
  changes: Change[],
  { prisma, logger }: SyncTMCUsersContext,
) => {
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

  const existing = groupBy(
    await prisma.user.findMany({
      where: { username: { in: Object.keys(changedEmailUsers) } },
    }),
    "username",
  )

  let counter = 0
  for (const [username, changes] of Object.entries(changedEmailUsers)) {
    const newestChange = changes[0]

    try {
      if (
        existing[username]?.length &&
        existing[username][0].email !== newestChange.new_value
      ) {
        await prisma.user.update({
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

if (!isTest) {
  syncTMCUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      _logger.error(error)
      process.exit(1)
    })
}
