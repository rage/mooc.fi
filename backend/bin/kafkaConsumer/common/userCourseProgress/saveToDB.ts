import { Message } from "./interfaces"
import { DateTime } from "luxon"
import {
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "@prisma/client"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { pushMessageToClient, MessageType } from "../../../../wsServer"
import getUserFromTMC from "../getUserFromTMC"
import { ok, err, Result } from "../../../../util/result"

import { DatabaseInputError, TMCError } from "../../../lib/errors"
import { KafkaContext } from "../kafkaContext"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { prisma, knex, logger } = context

  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  let user: User | null

  user = (await knex("user").where("upstream_id", message.user_id).limit(1))[0]

  if (!user) {
    try {
      user = await getUserFromTMC(prisma, message.user_id)
    } catch (e) {
      user = (
        await knex("user").where("upstream_id", message.user_id).limit(1)
      )[0]
      if (!user) {
        logger.error(new TMCError(`couldn't find user ${message.user_id}`, e))
        throw e
      }
      logger.info("Mitigated race condition with user imports")
    }
  }

  const course = await prisma.course.findUnique({
    where: { id: message.course_id },
  })

  if (!user || !course) {
    return err(
      new DatabaseInputError(
        `Invalid user or course: user ${message.user_id}, course ${message.course_id}`,
        message,
      ),
    )
  }

  const userCourseProgresses = await knex<unknown, UserCourseProgress[]>(
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

  const userCourseServiceProgresses = await knex<
    unknown,
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

  pushMessageToClient(
    message.user_id,
    message.course_id,
    MessageType.PROGRESS_UPDATED,
  )

  return ok("Saved to DB succesfully")
}
