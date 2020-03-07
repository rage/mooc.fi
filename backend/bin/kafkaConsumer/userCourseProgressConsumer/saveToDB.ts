import { Message } from "./interfaces"
import { DateTime } from "luxon"
import {
  Prisma,
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "../../../generated/prisma-client"
import TmcClient from "../../../services/tmc"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Logger } from "winston"
import { pushMessageToClient, MessageType } from "../../../wsServer"

import * as _KnexConstructor from "knex"

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

const getUserFromTMC = async (
  prisma: Prisma,
  user_id: number,
): Promise<User> => {
  const tmc: TmcClient = new TmcClient()
  const userDetails = await tmc.getUserDetailsById(user_id)

  return prisma.createUser({
    upstream_id: userDetails.id,
    first_name: userDetails.user_field.first_name,
    last_name: userDetails.user_field.last_name,
    email: userDetails.email,
    username: userDetails.username,
    administrator: userDetails.administrator,
  })
}

export const saveToDatabase = async (
  message: Message,
  prisma: Prisma,
  logger: Logger,
) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  let user: User | null

  user = (await Knex("user")
    .where("upstream_id", message.user_id)
    .limit(1))[0]

  if (!user) {
    user = await getUserFromTMC(prisma, message.user_id)
  }

  const course = (await Knex("course")
    .where("id", message.course_id)
    .limit(1))[0]

  if (!user || !course) {
    logger.error("Invalid user or course")
    return -1
  }

  let userCourseProgress = (await Knex<unknown, UserCourseProgress[]>(
    "user_course_progress",
  )
    .where("user", user?.id)
    .where("course", message.course_id)
    .limit(1))[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.createUserCourseProgress({
      course: { connect: { id: message.course_id } },
      user: { connect: { id: user?.id } },
      progress: message.progress,
    })
  }

  const userCourseServiceProgress = (await Knex<
    unknown,
    UserCourseServiceProgress[]
  >("user_course_service_progress")
    .where("user", user?.id)
    .where("course", message.course_id)
    .where("service", message.service_id)
    .limit(1))[0]

  if (userCourseServiceProgress) {
    const oldTimestamp = DateTime.fromISO(
      userCourseServiceProgress.timestamp ?? "",
    )

    if (timestamp < oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.updateUserCourseServiceProgress({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress,
        timestamp: timestamp.toJSDate(),
      },
    })
  } else {
    await prisma.createUserCourseServiceProgress({
      user: { connect: { id: user?.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,

      user_course_progress: { connect: { id: userCourseProgress.id } },
      timestamp: timestamp.toJSDate(),
    })
  }

  await generateUserCourseProgress({
    user,
    course,
    userCourseProgress,
    exerciseCompletionsBySection: message.exercise_completions_by_section,
  })

  pushMessageToClient(
    message.user_id,
    message.course_id,
    MessageType.PROGRESS_UPDATED,
  )
  logger.info("Saved to DB succesfully")
  return true
}
