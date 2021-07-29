require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import TmcClient from "../services/tmc"
import { PrismaClient, UserCourseSetting } from "@prisma/client"
import { UserInfo } from "../domain/UserInfo"
import { DateTime } from "luxon"
import prisma from "../prisma"
import sentryLogger from "./lib/logger"
import { DatabaseInputError, TMCError } from "./lib/errors"
import { convertUpdate } from "../util/db-functions"
import { notEmpty } from "../util/notEmpty"

const CONFIG_NAME = "userAppDatum"

let course
let old: UserCourseSetting

const logger = sentryLogger({ service: "fetch-user-app-datum" })

const fetchUserAppDatum = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  const existingConfig = await prisma.userAppDatumConfig.findFirst({
    where: { name: CONFIG_NAME },
  })
  const latestTimeStamp = existingConfig?.timestamp // ((await prisma.userAppDatumConfig.findOne({ name: CONFIG_NAME })) ?? {}).timestamp

  logger.info(latestTimeStamp)

  // weird
  const tmcData = await tmc.getUserAppDatum(
    latestTimeStamp?.toISOString() ?? null,
  )
  logger.info("Got data from tmc")
  logger.info(`data length ${tmcData.length}`)
  logger.info("sorting")

  const data = tmcData
    .sort(
      (a, b) =>
        DateTime.fromISO(a.updated_at).toMillis() -
        DateTime.fromISO(b.updated_at).toMillis(),
    )
    .filter(notEmpty)
    .filter((e) => e.user_id !== null)

  //  logger.info(data)
  // logger.info("sorted")
  const saveInterval = 10000
  let index = 0

  for (const e of data) {
    index++
    if (index % 1000 == 0) logger.info(`${index}/${data.length}`)

    const existingUsers = await prisma.user.findMany({
      where: { upstream_id: e.user_id },
    })

    if (existingUsers.length < 1) {
      try {
        await getUserFromTmcAndSaveToDB(e.user_id, tmc)
      } catch (error) {
        logger.error(
          new TMCError(
            "error in getting user data from tmc, trying again in 30s...",
            error,
          ),
        )
        await delay(30 * 1000)
        await getUserFromTmcAndSaveToDB(e.user_id, tmc)
      }
    }

    const existingCourses = await prisma.course.findMany({
      where: { slug: e.namespace },
    })
    if (existingCourses.length < 1) {
      await prisma.course.create({
        data: {
          slug: e.namespace,
          name: e.namespace,
          hidden: true,
          teacher_in_charge_name: "",
          teacher_in_charge_email: "",
          start_date: "",
        },
      })
    }

    course = await prisma.course.findUnique({ where: { slug: e.namespace } })

    if (!course) {
      process.exit(1)
    }

    const existingUserCourseSetting = await prisma.userCourseSetting.findFirst({
      where: {
        user: { upstream_id: e.user_id },
        course_id: course.id,
      },
    })
    if (!existingUserCourseSetting) {
      old = await prisma.userCourseSetting.create({
        data: {
          user: {
            connect: { upstream_id: e.user_id },
          },
          course: { connect: { id: course.id } },
        },
      })
    } else {
      old = existingUserCourseSetting
    }

    switch (e.field_name) {
      case "language":
        saveLanguage(e)
        break
      case "country":
        saveCountry(e)
        break
      case "research":
        saveResearch(e)
        break
      case "marketing":
        saveMarketing(e)
        break
      case "course_variant": //course_variant and deadline are functionally the same (deadline is used in elements-of-ai)
      case "deadline": // deadline does not tell when the deadline is but what is the course variant
        saveCourseVariant(e)
        break
      default:
        saveOther(e)
    }
    if (index % saveInterval == 0) {
      await saveProgress(prisma, new Date(e.updated_at))
    }
  }
  /*if (!p || p == "undefined" || p == null) {
      logger.warning(
        "not p:",
        p,
        "i is",
        i,
        "while data.length is",
        data.length,
      )
      continue
    }*/

  await saveProgress(prisma, new Date(data[data.length - 1].updated_at))

  const stopTime = new Date().getTime()
  logger.info(`used ${stopTime - startTime} milliseconds`)

  process.exit(0)
}

const saveLanguage = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      language: { set: p.value },
    },
  })
}
const saveCountry = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      country: { set: p.value },
    },
  })
}
const saveResearch = async (p: any) => {
  const value: boolean = p.value == "t" ? true : false
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      research: { set: value },
    },
  })
}
const saveMarketing = async (p: any) => {
  const value: boolean = p.value == "t" ? true : false
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      marketing: { set: value },
    },
  })
}
const saveCourseVariant = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      course_variant: { set: p.value },
    },
  })
}

const saveOther = async (p: any) => {
  const other: any = old.other ?? {}
  if (p.value == "t") {
    p.value = true
  } else if (p.value == "f") {
    p.value = false
  }
  other[p.field_name] = p.value

  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      other,
    },
  })
}

const getUserFromTmcAndSaveToDB = async (user_id: Number, tmc: TmcClient) => {
  let details: UserInfo | undefined

  try {
    details = await tmc.getUserDetailsById(user_id)
  } catch (e) {
    logger.error(new TMCError(`couldn't find user ${user_id}`, e))
    throw e
  }

  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
    password: "password",
  }
  try {
    const result = await prisma.user.upsert({
      where: { upstream_id: details.id },
      create: prismaDetails,
      update: convertUpdate(prismaDetails), // TODO: remove convertUpdate
    })

    return result
  } catch (e) {
    logger.error(
      new DatabaseInputError(
        `Failed to upsert user with upstream id ${
          details.id
        }. Values we tried to upsert: ${JSON.stringify(prismaDetails)}`,
        details,
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
      timestamp: { set: dateToDB },
    },
  })
}

fetchUserAppDatum().catch((e) => {
  logger.error(e)
  process.exit(1)
})
