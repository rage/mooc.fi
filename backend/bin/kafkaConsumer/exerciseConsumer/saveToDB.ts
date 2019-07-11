import { Message, ExerciseData } from "./interfaces"
import { Prisma, Exercise, prisma } from "../../../generated/prisma-client"
import { DateTime } from "luxon"
import winston = require("winston")

export const saveToDatabase = async (
  message: Message,
  prisma: Prisma,
  logger: winston.Logger,
): Promise<Boolean> => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  const courseExists = await prisma.$exists.course({ id: message.course_id })
  if (!courseExists) {
    logger.error("given course does not exist")
    return false
  }
  message.data.forEach(exercise => {
    handleExercise(
      exercise,
      message.course_id,
      message.timestamp,
      message.service_id,
      logger,
    )
  })

  await prisma.updateManyExercises({
    where: {
      AND: {
        course: { id: message.course_id },
        service: { id: message.service_id },
        custom_id_not_in: message.data.map(p => p.id),
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
) => {
  const exerciseExists = await prisma.$exists.exercise({
    custom_id: exercise.id,
  })
  if (exerciseExists) {
    const oldExercises: Exercise[] = await prisma.exercises({
      where: {
        course: { id: course_id },
        service: { id: service_id },
        custom_id: exercise.id,
      },
    })
    const oldExercise = oldExercises[0]
    if (oldExercise.timestamp > timestamp) {
      logger.error(
        "Timestamp is older than on existing exercise on " +
          exercise +
          "skipping this exercise",
      )
      return
    }
    await prisma.updateExercise({
      where: { id: oldExercise.id },
      data: {
        name: exercise.name,
        custom_id: exercise.id,
        part: Number(exercise.part),
        section: Number(exercise.section),
        max_points: Number(exercise.max_points),
        timestamp: timestamp,
        deleted: false,
      },
    })
  } else {
    await prisma.createExercise({
      name: exercise.name,
      custom_id: exercise.id,
      part: Number(exercise.part),
      section: Number(exercise.section),
      max_points: Number(exercise.max_points),
      course: { connect: { id: course_id } },
      service: { connect: { id: service_id } },
      timestamp: timestamp,
    })
  }
}
