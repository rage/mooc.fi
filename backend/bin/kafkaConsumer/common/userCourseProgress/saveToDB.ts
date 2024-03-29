import { DateTime } from "luxon"

import {
  Prisma,
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "@prisma/client"

import { DatabaseInputError, TMCError } from "../../../../lib/errors"
import { err, ok, parseTimestamp, Result } from "../../../../util"
import { MessageType, pushMessageToClient } from "../../../../wsServer"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"
import { KafkaContext } from "../kafkaContext"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Message } from "./interfaces"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { prisma, knex } = context

  let timestamp

  try {
    timestamp = parseTimestamp(message.timestamp)
  } catch (e) {
    return err(
      new DatabaseInputError(
        "Invalid date",
        message,
        e instanceof Error ? e : new Error(e as string),
      ),
    )
  }

  let user: User | undefined | null

  try {
    user = await getUserWithRaceCondition(context, message.user_id)
  } catch (e) {
    return err(
      new DatabaseInputError(
        "User not found",
        message,
        e instanceof Error ? e : new TMCError(e as string),
      ),
    )
  }

  if (!user) {
    return err(new DatabaseInputError(`Invalid user`, message))
  }

  const course = await prisma.course.findUnique({
    where: { id: message.course_id },
  })

  if (!course) {
    return err(new DatabaseInputError(`Invalid course`, message))
  }

  const userCourseProgresses = await knex<any, UserCourseProgress[]>(
    "user_course_progress",
  )
    .where("course_id", message.course_id)
    .andWhere("user_id", user.id)
    .orderBy("created_at", "asc")

  let userCourseProgress = userCourseProgresses[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.userCourseProgress.create({
      data: {
        course: {
          connect: { id: message.course_id },
        },
        user: { connect: { id: user.id } },
        progress: message.progress ?? Prisma.JsonNull,
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
    .where("service_id", message.service_id)
    .andWhere("course_id", message.course_id)
    .andWhere("user_id", user.id)
    .orderBy("created_at", "asc")

  const userCourseServiceProgress = userCourseServiceProgresses[0]

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
        progress: message.progress ?? Prisma.JsonNull,
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
        progress: message.progress ?? Prisma.JsonNull,
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
