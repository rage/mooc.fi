require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import TmcClient from "../services/tmc"
import { PrismaClient } from "@prisma/client"
import { UserInfo } from "../domain/UserInfo"
import { DateTime } from "luxon"
import prismaClient from "./lib/prisma"
import sentryLogger from "./lib/logger"
import { DatabaseInputError, TMCError } from "./lib/errors"

const CONFIG_NAME = "userFieldValues"

const prisma = prismaClient()

const logger = sentryLogger({ service: "fetch-user-field-values" })

const fetcUserFieldValues = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  // const prisma: Prisma = new Prisma()

  const existingConfig = await prisma.userAppDatumConfig.findMany({
    where: { name: CONFIG_NAME },
  })
  const latestTimeStamp =
    existingConfig.length > 0
      ? existingConfig[0].timestamp // ((await prisma.userAppDatumConfig({ name: CONFIG_NAME })) ?? {}).timestamp
      : null

  logger.info(latestTimeStamp)

  const data_from_tmc = await tmc.getUserFieldValues(
    latestTimeStamp?.toISOString() ?? null,
  )
  logger.info("Got data from tmc")
  logger.info("data length", data_from_tmc.length)
  logger.info("sorting")
  const data = data_from_tmc.sort(
    (a, b) =>
      DateTime.fromISO(a.updated_at).toMillis() -
      DateTime.fromISO(b.updated_at).toMillis(),
  )
  logger.info(data)
  logger.info("sorted")
  const saveInterval = 10000
  let saveCounter = 0

  for (let i = 0; i < data.length; i++) {
    saveCounter++
    let p = data[i]
    if (p.user_id == null) continue
    if (i % 1000 == 0) logger.info(i)
    if (!p || p == null) {
      logger.warning(
        "not p:",
        p,
        "i is",
        i,
        "while data.length is",
        data.length,
      )
      continue
    }
    const existingUsers = await prisma.user.findMany({
      where: {
        upstream_id: p.user_id,
      },
    })
    if (existingUsers.length < 1) {
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
          student_number: p.value.trim(),
        },
      })
    }

    if (saveCounter % saveInterval == 0) {
      saveProgress(prisma, new Date(p.updated_at))
    }
  }

  await saveProgress(prisma, new Date(data[data.length - 1].updated_at))

  const stopTime = new Date().getTime()
  logger.info("used", stopTime - startTime, "milliseconds")

  process.exit(0)
}

const getUserFromTmcAndSaveToDB = async (user_id: Number, tmc: TmcClient) => {
  const details: UserInfo = await tmc.getUserDetailsById(user_id)
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
  } catch (e) {
    logger.error(
      new DatabaseInputError(
        `Failed to upsert user with upstream id ${
          details.id
        }. Values we tried to upsert: ${JSON.stringify(
          prismaDetails,
        )}. Values found from the database: ${JSON.stringify(details)}`,
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

// FIXME: not used anywhere
/* const currentDate = () => {
  var today = new Date()
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var dateTime = date + " " + time
  return encodeURIComponent(dateTime)
} */
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function saveProgress(prisma: PrismaClient, dateToDB: Date) {
  logger.info("saving")
  dateToDB.setMinutes(dateToDB.getMinutes() - 10)

  await prisma.userAppDatumConfig.upsert({
    where: { name: CONFIG_NAME },
    create: {
      name: CONFIG_NAME,
      timestamp: dateToDB,
    },
    update: {
      timestamp: dateToDB,
    },
  })
}

fetcUserFieldValues().catch((e) => {
  logger.error(e)
  process.exit(1)
})
