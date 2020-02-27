import { Message } from "./interfaces"
import {
  Prisma,
  ExerciseCompletion,
  Exercise,
  User,
} from "../../../generated/prisma-client"
import TmcClient from "../../../services/tmc"
import { DateTime } from "luxon"
import winston = require("winston")

const isUserInDB = async (prisma: Prisma, user_id: number) => {
  return await prisma.$exists.user({ upstream_id: user_id })
}

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
  logger: winston.Logger,
): Promise<Boolean> => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  if (!(await isUserInDB(prisma, message.user_id))) {
    await getUserFromTMC(prisma, message.user_id)
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
      n_points: message.n_points,
      completed: message.completed,
      required_actions: {
        create: message.required_actions.map(ra => {
          return {
            value: ra,
          }
        }),
      },
      timestamp: message.timestamp,
    })
  } else {
    const oldTimestamp = DateTime.fromISO(exerciseCompleted.timestamp ?? "")
    if (timestamp < oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.updateExerciseCompletion({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        completed: message.completed,
        required_actions: {
          create: message.required_actions.map(ra => {
            return {
              value: ra,
            }
          }),
        },
        timestamp: message.timestamp,
      },
    })
  }
  logger.info("Saved to DB succesfully")
  return true
}
