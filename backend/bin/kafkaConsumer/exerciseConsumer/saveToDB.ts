import { Message, ExerciseData } from "./interfaces"
import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"
import winston = require("winston")
import { ok, err, Result } from "../../../util/result"
import { DatabaseInputError } from "../../lib/errors"
import { convertUpdate } from "../../../util/db-functions"

export const saveToDatabase = async (
  message: Message,
  prisma: PrismaClient,
  logger: winston.Logger,
): Promise<Result<string, Error>> => {
  if (!message.course_id) {
    return err(new DatabaseInputError("no course specified", message))
  }
  const existingCourse = await prisma.course.findUnique({
    where: { id: message.course_id },
  })
  if (!existingCourse) {
    return err(
      new DatabaseInputError(
        `Given course does not exist: id ${message.course_id}`,
        message,
      ),
    )
  }

  message.data.forEach((exercise) => {
    handleExercise(
      exercise,
      message.course_id,
      DateTime.fromISO(message.timestamp),
      message.service_id,
      logger,
      prisma,
    )
  })

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

const handleExercise = async (
  exercise: ExerciseData,
  course_id: string,
  timestamp: DateTime,
  service_id: string,
  logger: winston.Logger,
  prisma: PrismaClient,
) => {
  const existingExercise = await prisma.exercise.findFirst({
    where: {
      course_id: course_id,
      service_id: service_id,
      custom_id: exercise.id,
    },
  })
  if (existingExercise) {
    // FIXME: well this is weird
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
      data: convertUpdate({
        name: exercise.name,
        custom_id: exercise.id,
        part: Number(exercise.part),
        section: Number(exercise.section),
        max_points: Number(exercise.max_points),
        timestamp: timestamp.toJSDate(),
        deleted: false,
      }),
    })
  } else {
    await prisma.exercise.create({
      data: {
        name: exercise.name,
        custom_id: exercise.id,
        part: Number(exercise.part),
        section: Number(exercise.section),
        max_points: Number(exercise.max_points),
        course: { connect: { id: course_id } },
        service: { connect: { id: service_id } },
        timestamp: timestamp.toJSDate(),
      },
    })
  }
}
