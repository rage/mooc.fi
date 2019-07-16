require("dotenv-safe").config()
import TmcClient from "../services/tmc"
import {
  Prisma,
  Course,
  UserCourseSettings,
  User,
} from "../generated/prisma-client"
import { UserInfo } from "../domain/UserInfo"

const prisma: Prisma = new Prisma()
let course: Course
let old: UserCourseSettings

const fetcUserAppDatum = async () => {
  const startTime = new Date().getTime()
  const tmc = new TmcClient()

  const prisma: Prisma = new Prisma()
  const startTimestamp = new Date()
  const latestTimeStamp = (await prisma.$exists.userAppDatumConfig({
    name: "userAppDatum2",
  }))
    ? (await prisma.userAppDatumConfig({ name: "userAppDatum2" })).timestamp
    : null
  const data = await tmc.getUserAppDatum(latestTimeStamp)

  console.log("data length", data.length)
  for (let i = 0; i < data.length; i++) {
    let p = data[i]
    if (p.user_id == null) continue
    if (i % 1000 == 0) console.log(i)
    if (!p || p == "undefined" || p == null) {
      console.log("not p:", p, "i is", i, "while data.length is", data.length)
      continue
    }
    const isUser: Boolean = await prisma.$exists.user({
      upstream_id: p.user_id,
    })
    if (!isUser) {
      try {
        await getUserFromTmc(p.user_id, tmc)
      } catch (error) {
        console.log(
          "error in getting user data from tmc, trying again in 30s...",
        )
        console.log("above error is:", error)
        delay(30 * 1000)
        await getUserFromTmc(p.user_id, tmc)
      }
    }
    const isCourse: Boolean = await prisma.$exists.course({ slug: p.namespace })
    if (!isCourse) {
      await prisma.createCourse({
        slug: p.namespace,
        name: p.namespace,
      })
    }
    course = await prisma.course({ slug: p.namespace })
    const isOld: Boolean = await prisma.$exists.userCourseSettings({
      user: { upstream_id: p.user_id },
      course: { id: course.id },
    })
    if (!isOld) {
      old = await prisma.createUserCourseSettings({
        user: { connect: { upstream_id: p.user_id } },
        course: { connect: { id: course.id } },
      })
    } else {
      const tmp: UserCourseSettings[] = await prisma.userCourseSettingses({
        where: {
          user: { upstream_id: p.user_id },
          course: { id: course.id },
        },
      })
      old = tmp[0]
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
  }
  await prisma.upsertUserAppDatumConfig({
    where: { name: "userAppDatum2" },
    create: {
      name: "userAppDatum",
      timestamp: startTimestamp,
    },
    update: {
      timestamp: startTimestamp,
    },
  })
  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "milliseconds")
}

const saveLanguage = async p => {
  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      language: p.value,
    },
  })
}
const saveCountry = async p => {
  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      country: p.value,
    },
  })
}
const saveResearch = async p => {
  const value: boolean = p.value == "t" ? true : false
  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      research: value,
    },
  })
}
const saveMarketing = async p => {
  const value: boolean = p.value == "t" ? true : false
  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      marketing: value,
    },
  })
}
const saveCourseVariant = async p => {
  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      course_variant: p.value,
    },
  })
}
const saveOther = async p => {
  const other = old.other || {}
  if (p.value == "t") p.value = true
  else if (p.value == "f") p.value = false
  other[p.field_name] = p.value

  await prisma.updateUserCourseSettings({
    where: {
      id: old.id,
    },
    data: {
      other: other,
    },
  })
}

const getUserFromTmc = async (user_id: Number, tmc): Promise<User> => {
  const details: UserInfo = await tmc.getUserDetailsById(user_id)
  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }
  return await prisma.upsertUser({
    where: { upstream_id: details.id },
    create: prismaDetails,
    update: prismaDetails,
  })
}

const currentDate = () => {
  var today = new Date()
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var dateTime = date + " " + time
  return encodeURIComponent(dateTime)
}
const delay = ms => new Promise(res => setTimeout(res, ms))

fetcUserAppDatum().catch(e => console.log(e))
