import { DateTime } from "luxon"

import { DatabaseInputError } from "../../../lib/errors"
import { err, ok, Result } from "../../../util/result"
import { KafkaContext } from "../common/kafkaContext"
import { parseTimestamp } from "../util"
import { ExerciseData, Message } from "./interfaces"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { prisma } = context

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
  if (!message.course_id) {
    return err(new DatabaseInputError("no course specified", message))
  }
  const existingCourse = await prisma.course.findUnique({
    where: { id: message.course_id },
  })
  if (!existingCourse) {
    return err(new DatabaseInputError(`Given course does not exist`, message))
  }

  for (const exercise of message.data) {
    await handleExercise({
      context,
      exercise,
      course_id: message.course_id,
      timestamp,
      service_id: message.service_id,
    })
  }

  await prisma.exercise.updateMany({
    where: {
      AND: {
        course_id: message.course_id,
        service_id: message.service_id,
        custom_id: { not: { in: message.data.map((p) => p.id.toString()) } },
      },
    },
    data: {
      deleted: { set: true },
    },
  })

  return ok("Saved to DB successfully")
}

interface HandleExerciseConfig {
  context: KafkaContext
  exercise: ExerciseData
  course_id: string
  timestamp: DateTime
  service_id: string
}

const parseExercisePart = (part: string | number) => {
  if (typeof part === "number") {
    return part
  }
  const parsedPart = Number(part.match(/^osa(\d+)$/)?.[1])

  // invalid string patterns are already handled by validation, but let's be sure
  return isNaN(parsedPart) ? null : parsedPart
}

const handleExercise = async ({
  context: { prisma, logger },
  exercise,
  course_id,
  timestamp,
  service_id,
}: HandleExerciseConfig) => {
  const existingExercise = (
    await prisma.course
      .findUnique({
        where: {
          id: course_id,
        },
      })
      .exercises({
        where: {
          service_id,
          custom_id: exercise.id,
        },
      })
  )?.[0]

  const exercisePart = parseExercisePart(exercise.part)

  if (existingExercise) {
    if (
      DateTime.fromISO(existingExercise.timestamp?.toISOString() ?? "") >
      timestamp
    ) {
      logger.warn(
        "Timestamp is older than on existing exercise on " +
          JSON.stringify(exercise) +
          "skipping this exercise",
      )
      return
    }
    await prisma.exercise.update({
      where: { id: existingExercise.id },
      data: {
        name: exercise.name,
        custom_id: exercise.id,
        part: { set: exercisePart },
        section: { set: Number(exercise.section) },
        max_points: { set: Number(exercise.max_points) },
        timestamp: timestamp.toJSDate(),
        deleted: { set: false },
      },
    })
  } else {
    await prisma.exercise.create({
      data: {
        name: exercise.name,
        custom_id: exercise.id,
        part: exercisePart,
        section: Number(exercise.section),
        max_points: Number(exercise.max_points),
        course: { connect: { id: course_id } },
        service: { connect: { id: service_id } },
        timestamp: timestamp.toJSDate(),
      },
    })
  }
}
