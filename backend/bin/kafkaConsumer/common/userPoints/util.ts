import { DateTime } from "luxon"

import { User } from "@prisma/client"

import { DatabaseInputError, TMCError } from "../../../../lib/errors"
import { err, ok } from "../../../../util/result"
import { parseTimestamp } from "../../util"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"
import { KafkaContext } from "../kafkaContext"

export const getTimestamp = <M extends { timestamp: string }>(
  { logger }: KafkaContext,
  message: M,
) => {
  logger.info("Parsing timestamp")

  let timestamp: DateTime

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

  return ok(timestamp)
}

export const getUser = async <M extends { user_id: number }>(
  context: KafkaContext,
  message: M,
) => {
  const { logger } = context
  logger.info(`Checking if user ${message.user_id} exists`)

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

  return ok(user)
}

export const getCourse = async <M extends { course_id: string }>(
  { prisma }: KafkaContext,
  message: M,
) => {
  const course = await prisma.course.findUnique({
    where: { id: message.course_id },
    include: {
      completions_handled_by: true,
    },
  })

  if (!course) {
    return err(new DatabaseInputError(`Invalid course`, message))
  }
  return ok(course)
}
