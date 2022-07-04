import { DateTime } from "luxon"

import { UserCourseProgress, UserCourseServiceProgress } from "@prisma/client"

import { err, ok, Result } from "../../../../util/result"
import { MessageType, pushMessageToClient } from "../../../../wsServer"
import { DatabaseInputError } from "../../../lib/errors"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"
import { KafkaContext } from "../kafkaContext"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Message } from "./interfaces"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { prisma, knex } = context

  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  const user = await getUserWithRaceCondition(context, message.user_id)

  const course = await prisma.course.findUnique({
    where: { id: message.course_id },
  })

  if (!user || !course) {
    return err(new DatabaseInputError(`Invalid user or course`, message))
  }

  const userCourseProgresses = await knex<any, UserCourseProgress[]>(
    "user_course_progress",
  )
    .where("user_id", user.id)
    .where("course_id", message.course_id)
    .orderBy("created_at", "asc")

  let userCourseProgress = userCourseProgresses[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.userCourseProgress.create({
      data: {
        course: {
          connect: { id: message.course_id },
        },
        user: { connect: { id: user.id } },
        progress: message.progress as any, // type error without any
      },
    })
  } else if (userCourseProgresses.length > 1) {
    // prune extra userCourseProgresses
    await prisma.userCourseProgress.deleteMany({
      where: { id: { in: userCourseProgresses.slice(1).map((ucp) => ucp.id) } },
    })
  }

  // TODO: here we could ensure the right service progress to searching for only the ones connected to the main course progress
  const userCourseServiceProgresses = await knex<
    any,
    UserCourseServiceProgress[]
  >("user_course_service_progress")
    .where("user_id", user.id)
    .where("course_id", message.course_id)
    .where("service_id", message.service_id)
    .orderBy("created_at", "asc")

  let userCourseServiceProgress = userCourseServiceProgresses[0]

  if (userCourseServiceProgress) {
    if (userCourseServiceProgresses.length > 1) {
      // prune extra userCourseServiceProgresses
      await prisma.userCourseServiceProgress.deleteMany({
        where: {
          id: {
            in: userCourseServiceProgresses.slice(1).map((ucsp) => ucsp.id),
          },
        },
      })
    }
    // FIXME: weird
    const oldTimestamp = DateTime.fromISO(
      userCourseServiceProgress?.timestamp?.toISOString() ?? "",
    )

    if (timestamp < oldTimestamp) {
      return ok("Timestamp older than in DB, aborting")
    }
    await prisma.userCourseServiceProgress.update({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress as any, // type error without any
        timestamp: { set: timestamp.toJSDate() },
      },
    })
  } else {
    await prisma.userCourseServiceProgress.create({
      data: {
        user: { connect: { id: user.id } },
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
    context,
  })

  await pushMessageToClient(
    message.user_id,
    message.course_id,
    MessageType.PROGRESS_UPDATED,
  )

  return ok("Saved to DB successfully")
}
