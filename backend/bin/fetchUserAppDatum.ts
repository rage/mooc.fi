import { DateTime } from "luxon"

import { Course, Prisma, UserCourseSetting } from "@prisma/client"

import { CONFIG_NAME } from "../config"
import { UserInfo } from "../domain/UserInfo"
import { DatabaseInputError, TMCError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import TmcClient from "../services/tmc"
import { notEmpty } from "../util/notEmpty"

const USER_APP_DATUM_CONFIG_NAME = CONFIG_NAME ?? "userAppDatum"

let course: Course | null
let old: UserCourseSetting

const logger = sentryLogger({ service: "fetch-user-app-datum" })

const fetchUserAppDatum = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  const existingConfig = await prisma.userAppDatumConfig.findFirst({
    where: { name: USER_APP_DATUM_CONFIG_NAME },
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

  tmcData.sort(
    (a, b) =>
      DateTime.fromISO(a.updated_at).toMillis() -
      DateTime.fromISO(b.updated_at).toMillis(),
  )

  const data = tmcData.filter(notEmpty).filter((e) => e.user_id !== null)

  //  logger.info(data)
  // logger.info("sorted")
  const saveInterval = 10000
  let index = 0

  for (const e of data) {
    index++
    if (index % 1000 == 0) logger.info(`${index}/${data.length}`)

    const user = await prisma.user.findUnique({
      where: { upstream_id: e.user_id },
    })

    if (!user) {
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

    course = await prisma.course.findUnique({
      where: { slug: e.namespace },
    })
    if (!course) {
      course = await prisma.course.create({
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

    if (!course) {
      process.exit(1)
    }

    const existingUserCourseSetting = (
      await prisma.user
        .findUnique({
          where: {
            upstream_id: e.user_id,
          },
        })
        .user_course_settings({
          where: {
            course_id: course.inherit_settings_from_id ?? course.id,
          },
          orderBy: {
            created_at: "asc",
          },
        })
    )?.[0]

    if (!existingUserCourseSetting) {
      old = await prisma.userCourseSetting.create({
        data: {
          user: {
            connect: { upstream_id: e.user_id },
          },
          course: {
            connect: { id: course.inherit_settings_from_id ?? course.id },
          },
        },
      })
    } else {
      old = existingUserCourseSetting
    }

    switch (e.field_name) {
      case "language":
        await saveLanguage(e)
        break
      case "country":
        await saveCountry(e)
        break
      case "research":
        await saveResearch(e)
        break
      case "marketing":
        await saveMarketing(e)
        break
      case "course_variant": //course_variant and deadline are functionally the same (deadline is used in elements-of-ai)
      case "deadline": // deadline does not tell when the deadline is but what is the course variant
        await saveCourseVariant(e)
        break
      default:
        await saveOther(e)
    }
    if (index % saveInterval == 0) {
      await saveProgress(new Date(e.updated_at))
    }
  }

  await saveProgress(new Date(data[data.length - 1].updated_at))

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
  const other = (old.other as Prisma.JsonObject) ?? {}
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

const getUserFromTmcAndSaveToDB = async (user_id: number, tmc: TmcClient) => {
  let details: UserInfo | undefined

  try {
    details = await tmc.getUserDetailsById(user_id)
  } catch (e) {
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
    where: { name: USER_APP_DATUM_CONFIG_NAME },
    create: {
      name: USER_APP_DATUM_CONFIG_NAME,
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
