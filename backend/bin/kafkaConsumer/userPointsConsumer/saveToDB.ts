import { Message } from "./interfaces"
import {
  Prisma,
  ExerciseCompletion,
  Exercise,
} from "../../../generated/prisma-client"
import { DateTime } from "luxon"
import winston = require("winston")
import { validateTimestamp } from "./validate"

export const saveToDatabase = async (
  message: Message,
  prisma: Prisma,
  logger: winston.Logger,
): Promise<Boolean> => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)
  if (!validateTimestamp(timestamp)) {
    logger.error("invalid timestamp")
    return
  }
  const isExercise = await prisma.$exists.exercise({
    custom_id: message.exercise_id,
  })
  if (!isExercise) {
    logger.error("Given exercise does not exist")
    return false
  }
  const exercises: Exercise[] = await prisma.exercises({
    where: {
      course: { id: message.course_id },
      service: { id: message.service_id },
    },
  })
  const exercice = exercises[0]
  const exerciseCompleteds: ExerciseCompletion[] = await prisma.exerciseCompletions(
    {
      first: 1,
      where: {
        exercise: { custom_id: message.exercise_id },
        user: { upstream_id: Number(message.user_id) },
      },
    },
  )
  const exerciseCompleted = exerciseCompleteds[0]
  if (!exerciseCompleted) {
    await prisma.createExerciseCompletion({
      exercise: { connect: { id: exercice.id } },
      user: { connect: { upstream_id: Number(message.user_id) } },
      n_points: Number(message.n_points),
      required_actions:
        message.required_actions == null ? null : message.required_actions,
      timestamp: message.timestamp,
    })
  } else {
    const oldTimestamp = DateTime.fromISO(exerciseCompleted.timestamp)
    if (timestamp < oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.updateExerciseCompletion({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        required_actions:
          message.required_actions == null ? null : message.required_actions,
        timestamp: message.timestamp,
      },
    })
  }
  logger.info("Saved to DB succesfully")
  return true
}
