require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import TmcClient from "../services/tmc"
import { PrismaClient, UserCourseSetting } from "@prisma/client"
import { UserInfo } from "../domain/UserInfo"
import { DateTime } from "luxon"
import prismaClient from "./lib/prisma"

const CONFIG_NAME = "userAppDatum"

const prisma = prismaClient()
let course
let old: UserCourseSetting

const fetchUserAppDatum = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  // const prisma: Prisma = new Prisma()

  const existingConfigs = await prisma.userAppDatumConfig.findMany({
    where: { name: CONFIG_NAME },
  })
  const latestTimeStamp =
    existingConfigs.length > 0
      ? existingConfigs[0].timestamp // ((await prisma.userAppDatumConfig.findOne({ name: CONFIG_NAME })) ?? {}).timestamp
      : null

  console.log(latestTimeStamp)

  // weird
  const data_from_tmc = await tmc.getUserAppDatum(
    latestTimeStamp?.toISOString() ?? null,
  )
  console.log("Got data from tmc")
  console.log("data length", data_from_tmc.length)
  console.log("sorting")
  const data = data_from_tmc.sort(
    (a, b) =>
      DateTime.fromISO(a.updated_at).toMillis() -
      DateTime.fromISO(b.updated_at).toMillis(),
  )
  console.log(data)
  console.log("sorted")
  const saveInterval = 10000
  let saveCounter = 0

  for (let i = 0; i < data.length; i++) {
    saveCounter++
    let p = data[i]
    if (p.user_id == null) continue
    if (i % 1000 == 0) console.log(i)
    if (!p || p == "undefined" || p == null) {
      console.log("not p:", p, "i is", i, "while data.length is", data.length)
      continue
    }
    const existingUsers = await prisma.user.findMany({
      where: { upstream_id: p.user_id },
    })
    if (existingUsers.length < 1) {
      try {
        await getUserFromTmcAndSaveToDB(p.user_id, tmc)
      } catch (error) {
        console.log(
          "error in getting user data from tmc, trying again in 30s...",
        )
        console.log("above error is:", error)
        await delay(30 * 1000)
        await getUserFromTmcAndSaveToDB(p.user_id, tmc)
      }
    }
    const existingCourses = await prisma.course.findMany({
      where: { slug: p.namespace },
    })
    if (existingCourses.length < 1) {
      await prisma.course.create({
        data: {
          slug: p.namespace,
          name: p.namespace,
          hidden: true,
          teacher_in_charge_name: "",
          teacher_in_charge_email: "",
          start_date: "",
        },
      })
    }

    course = await prisma.course.findOne({ where: { slug: p.namespace } })

    if (!course) {
      process.exit(1)
    }

    const existingUserCourseSettings = await prisma.userCourseSetting.findMany({
      where: {
        user: { upstream_id: p.user_id },
        course_id: course.id,
      },
    })
    if (existingUserCourseSettings.length < 1) {
      old = await prisma.userCourseSetting.create({
        data: {
          user: {
            connect: { upstream_id: p.user_id },
          },
          course: { connect: { id: course.id } },
        },
      })
    } else {
      old = existingUserCourseSettings[0]
    }

    switch (p.field_name) {
      case "language":
        saveLanguage(p)
        break
      case "country":
        saveCountry(p)
        break
      case "research":
        saveResearch(p)
        break
      case "marketing":
        saveMarketing(p)
        break
      case "course_variant": //course_variant and deadline are functionally the same (deadline is used in elements-of-ai)
      case "deadline": // deadline does not tell when the deadline is but what is the course variant
        saveCourseVariant(p)
        break
      default:
        saveOther(p)
    }
    if (saveCounter % saveInterval == 0)
      saveProgress(prisma, new Date(p.updated_at))
  }

  await saveProgress(prisma, new Date(data[data.length - 1].updated_at))

  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "milliseconds")
}

const saveLanguage = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      language: p.value,
    },
  })
}
const saveCountry = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      country: p.value,
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
      research: value,
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
      marketing: value,
    },
  })
}
const saveCourseVariant = async (p: any) => {
  await prisma.userCourseSetting.update({
    where: {
      id: old.id,
    },
    data: {
      course_variant: p.value,
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
      other: other,
    },
  })
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
    console.log(
      `Failed to upsert user with upstream id ${
        details.id
      }. Values we tried to upsert: ${JSON.stringify(
        prismaDetails,
      )}. Values found from the database: ${JSON.stringify(details)}`,
    )
    if (e.meta?.target?.includes("username")) {
      console.log(`Removing user with duplicate username`)
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
  console.log("saving")
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

fetchUserAppDatum().catch((e) => console.log(e))
