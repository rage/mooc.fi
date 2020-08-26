import { Message } from "./interfaces"
import { DateTime } from "luxon"
import {
  PrismaClient,
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "@prisma/client"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Logger } from "winston"
import { pushMessageToClient, MessageType } from "../../../wsServer"
import getUserFromTMC from "../common/getUserFromTMC"

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

export const saveToDatabase = async (
  message: Message,
  prisma: PrismaClient,
  logger: Logger,
) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  let user: User | null

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
    await Knex<unknown, UserCourseProgress[]>("user_course_progress")
      .where("user_id", user?.id)
      .where("course_id", message.course_id)
      .limit(1)
  )[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.userCourseProgress.create({
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
    await Knex<unknown, UserCourseServiceProgress[]>(
      "user_course_service_progress",
    )
      .where("user_id", user?.id)
      .where("course_id", message.course_id)
      .where("service_id", message.service_id)
      .limit(1)
  )[0]

  if (userCourseServiceProgress) {
    // FIXME: weird
    const oldTimestamp = DateTime.fromISO(
      userCourseServiceProgress?.timestamp?.toISOString() ?? "",
    )

    if (timestamp < oldTimestamp) {
      logger.info("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.userCourseServiceProgress.update({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress as any, // type error without any
        timestamp: timestamp.toJSDate(),
      },
    })
  } else {
    await prisma.userCourseServiceProgress.create({
      data: {
        user: { connect: { id: user?.id } },
        course: {
          connect: { id: message.course_id },
        },
        service: {
          connect: { id: message.service_id },
        },
        progress: message.progress as any, // type error without any
        user_course_progress: {
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
