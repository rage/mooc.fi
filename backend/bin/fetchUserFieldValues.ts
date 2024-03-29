import { DateTime } from "luxon"

import { CONFIG_NAME } from "../config"
import { UserInfo } from "../domain/UserInfo"
import { DatabaseInputError, TMCError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import TmcClient from "../services/tmc"

const FETCH_USER_FIELD_VALUES_CONFIG_NAME = CONFIG_NAME ?? "userFieldValues"

const logger = sentryLogger({ service: "fetch-user-field-values" })

const fetchUserFieldValues = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  const existingConfig = await prisma.userAppDatumConfig.findFirst({
    where: { name: FETCH_USER_FIELD_VALUES_CONFIG_NAME },
  })
  const latestTimeStamp = existingConfig?.timestamp

  logger.info(latestTimeStamp)

  const data = await tmc.getUserFieldValues(
    latestTimeStamp?.toISOString() ?? null,
  )
  logger.info("Got data from tmc")
  logger.info(`data length ${data.length}`)
  logger.info("sorting")

  data.sort(
    (a, b) =>
      DateTime.fromISO(a.updated_at).toMillis() -
      DateTime.fromISO(b.updated_at).toMillis(),
  )
  // logger.info(data)
  // logger.info("sorted")
  const saveInterval = 10000
  let saveCounter = 0

  for (let i = 0; i < data.length; i++) {
    saveCounter++
    const p = data[i]
    if (p.user_id == null) continue
    if (i % 1000 == 0) logger.info(`${i}/${data.length}`)
    if (!p || p == null) {
      logger.warn("not p:", p, "i is", i, "while data.length is", data.length)
      continue
    }
    const user = await prisma.user.findUnique({
      where: {
        upstream_id: p.user_id,
      },
    })
    if (!user) {
      try {
        await getUserFromTmcAndSaveToDB(p.user_id, tmc)
      } catch (error) {
        logger.error(
          new TMCError(
            "error in getting user data from tmc, trying again in 30s...",
            error,
          ),
        )
        await delay(30 * 1000)
        await getUserFromTmcAndSaveToDB(p.user_id, tmc)
      }
    }

    if (
      p.field_name === "organizational_id" &&
      p.value &&
      p.value.trim() != ""
    ) {
      await prisma.user.update({
        where: { upstream_id: p.user_id },
        data: {
          student_number: { set: p.value.trim() },
        },
      })
    }

    if (saveCounter % saveInterval == 0) {
      await saveProgress(new Date(p.updated_at))
    }
  }

  await saveProgress(new Date(data[data.length - 1].updated_at))

  const stopTime = new Date().getTime()
  logger.info(`used ${stopTime - startTime} milliseconds`)

  await prisma.$disconnect()
  process.exit(0)
}

const getUserFromTmcAndSaveToDB = async (user_id: number, tmc: TmcClient) => {
  let details: UserInfo | undefined

  try {
    details = await tmc.getUserDetailsById(user_id)
  } catch (e: any) {
    logger.error(new TMCError(`couldn't find user`, { user_id }, e))
    throw e
  }

  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }
  try {
    const result = await prisma.user.upsert({
      where: { upstream_id: details.id },
      create: prismaDetails,
      update: prismaDetails,
    })

    return result
  } catch (e: any) {
    logger.error(
      new DatabaseInputError(
        `Failed to upsert user`,
        { details, prismaDetails },
        e,
      ),
    )
    if (e.meta?.target?.includes("username")) {
      logger.info(`Removing user with duplicate username`)
      await prisma.user.delete({ where: { username: details.username } })
    }
    throw e
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function saveProgress(dateToDB: Date) {
  logger.info("saving")
  dateToDB.setMinutes(dateToDB.getMinutes() - 10)

  await prisma.userAppDatumConfig.upsert({
    where: { name: FETCH_USER_FIELD_VALUES_CONFIG_NAME },
    create: {
      name: FETCH_USER_FIELD_VALUES_CONFIG_NAME,
      timestamp: dateToDB,
    },
    update: {
      timestamp: { set: dateToDB },
    },
  })
}

fetchUserFieldValues().catch((e) => {
  logger.error(e)
  process.exit(1)
})
