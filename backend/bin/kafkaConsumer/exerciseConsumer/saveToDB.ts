import { Message, ExerciseData } from "./interfaces"
import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"
import winston = require("winston")

export const saveToDatabase = async (
  message: Message,
  prisma: PrismaClient,
  logger: winston.Logger,
): Promise<Boolean> => {
  const existingCourse = await prisma.course.findOne({
    where: { id: message.course_id },
  })
  if (!existingCourse) {
    logger.error("given course does not exist")
    return false
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
        custom_id: { not: { in: message.data.map((p) => p.id) } },
      },
    },
    data: {
      deleted: true,
    },
  })

  logger.info("Saved to DB succesfully")
  return true
}

const handleExercise = async (
  exercise: ExerciseData,
  course_id: string,
  timestamp: DateTime,
  service_id: string,
  logger: winston.Logger,
  prisma: PrismaClient,
) => {
  const existingExercises = await prisma.exercise.findMany({
    where: {
      course_id: course_id,
      service_id: service_id,
      custom_id: exercise.id,
    },
  })
  if (existingExercises.length > 0) {
    const oldExercises = await prisma.exercise.findMany({
      where: {
        course_id: course_id,
        service_id: service_id,
        custom_id: exercise.id,
      },
    })

    const oldExercise = oldExercises[0]
    // FIXME: well this is weird
    if (
      DateTime.fromISO(oldExercise.timestamp?.toISOString() ?? "") > timestamp
    ) {
      logger.warn(
        "Timestamp is older than on existing exercise on " +
          JSON.stringify(exercise) +
          "skipping this exercise",
      )
      return
    }
    await prisma.exercise.update({
      where: { id: oldExercise.id },
      data: {
        name: exercise.name,
        custom_id: exercise.id,
        part: Number(exercise.part),
        section: Number(exercise.section),
        max_points: Number(exercise.max_points),
        timestamp: timestamp.toJSDate(),
        deleted: false,
      },
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
