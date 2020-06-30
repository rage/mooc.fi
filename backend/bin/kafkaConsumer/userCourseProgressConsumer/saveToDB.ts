import { Message } from "./interfaces"
import { DateTime } from "luxon"
import {
  PrismaClient,
  user,
  user_course_progress,
  user_course_service_progress,
} from "@prisma/client"
import TmcClient from "../../../services/tmc"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Logger } from "winston"
import { pushMessageToClient, MessageType } from "../../../wsServer"

import _KnexConstructor from "knex"

const Knex = _KnexConstructor({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  searchPath:
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})

const getUserFromTMC = async (prisma: PrismaClient, user_id: number) => {
  const tmc: TmcClient = new TmcClient()
  const userDetails = await tmc.getUserDetailsById(user_id)

  return prisma.user.create({
    data: {
      upstream_id: userDetails.id,
      first_name: userDetails.user_field.first_name,
      last_name: userDetails.user_field.last_name,
      email: userDetails.email,
      username: userDetails.username,
      administrator: userDetails.administrator,
    },
  })
}

export const saveToDatabase = async (
  message: Message,
  prisma: PrismaClient,
  logger: Logger,
) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  let user: user | null

  user = (await Knex("user").where("upstream_id", message.user_id).limit(1))[0]

  if (!user) {
    try {
      user = await getUserFromTMC(prisma, message.user_id)
    } catch (e) {
      user = (
        await Knex("user").where("upstream_id", message.user_id).limit(1)
      )[0]
      if (!user) {
        throw e
      }
      console.log("Mitigated race condition with user imports")
    }
  }

  const course = await prisma.course.findOne({
    where: { id: message.course_id },
  })

  if (!user || !course) {
    logger.error("Invalid user or course")
    return -1
  }

  let userCourseProgress = (
    await Knex<unknown, user_course_progress[]>("user_course_progress")
      .where("user", user?.id)
      .where("course", message.course_id)
      .limit(1)
  )[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.user_course_progress.create({
      data: {
        course: {
          connect: { id: message.course_id },
        },
        user: { connect: { id: user?.id } },
        progress: message.progress as any, // type error without any
      },
    })
  }

  const userCourseServiceProgress = (
    await Knex<unknown, user_course_service_progress[]>(
      "user_course_service_progress",
    )
      .where("user", user?.id)
      .where("course", message.course_id)
      .where("service", message.service_id)
      .limit(1)
  )[0]

  if (userCourseServiceProgress) {
    // FIXME: weird
    const oldTimestamp = DateTime.fromISO(
      userCourseServiceProgress?.timestamp?.toISOString() ?? "",
    )

    if (timestamp < oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.user_course_service_progress.update({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress as any, // type error without any
        timestamp: timestamp.toJSDate(),
      },
    })
  } else {
    await prisma.user_course_service_progress.create({
      data: {
        user_userTouser_course_service_progress: { connect: { id: user?.id } },
        course_courseTouser_course_service_progress: {
          connect: { id: message.course_id },
        },
        service_serviceTouser_course_service_progress: {
          connect: { id: message.service_id },
        },
        progress: message.progress as any, // type error without any
        user_course_progress_user_course_progressTouser_course_service_progress: {
          connect: { id: userCourseProgress.id },
        },
        timestamp: timestamp.toJSDate(),
      },
    })
  }

  await generateUserCourseProgress({
    user,
    course,
    userCourseProgress,
  })

  pushMessageToClient(
    message.user_id,
    message.course_id,
    MessageType.PROGRESS_UPDATED,
  )
  logger.info("Saved to DB succesfully")
  return true
}
