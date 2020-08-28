import { Message } from "./interfaces"
import { PrismaClient, ExerciseCompletion, User } from "@prisma/client"
import { DateTime } from "luxon"
import winston = require("winston")
import { CheckCompletion } from "../userCourseProgressConsumer/generateUserCourseProgress"
import knex from "knex"
import getUserFromTMC from "../common/getUserFromTMC"
import { ok, err, Result } from "../common/result"
import { DatabaseInputError } from "../../lib/errors"

const Knex = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  searchPath:
    // TODO: should this use the env search path?
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})

// @ts-ignore: not used
const isUserInDB = async (user_id: number) => {
  return await Knex("user").where("upstream_id", "=", user_id)
}

export const saveToDatabase = async (
  message: Message,
  prisma: PrismaClient,
  logger: winston.Logger,
): Promise<Result<string, Error>> => {
  logger.info("Parsing timestamp")
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  logger.info(`Checking if user ${message.user_id} exists.`)

  let user: User | null

  user = (await Knex("user").where("upstream_id", message.user_id).limit(1))[0]

  if (!user) {
    try {
      user = await getUserFromTMC(prisma, message.user_id)
    } catch (e) {
      user = (
        await Knex("user").where("upstream_id", message.user_id).limit(1)
      )[0]
      if (!user) {
        throw e
      }
      console.log("Mitigated race condition with user imports")
    }
  }

  const course = await prisma.course.findOne({
    where: { id: message.course_id },
  })

  if (!user || !course) {
    return err(new DatabaseInputError("Invalid user or course", message))
  }

  logger.info("Checking if a exercise exists with id " + message.exercise_id)
  const existingExercises = await prisma.exercise.findMany({
    where: { custom_id: message.exercise_id },
  })
  if (existingExercises.length < 1) {
    return err(new DatabaseInputError(`Given exercise does not exist`, message))
  }
  logger.info("Getting the exercise")
  const exercises = await prisma.exercise.findMany({
    take: 1,
    where: {
      custom_id: message.exercise_id,
    },
  })

  const exercise = exercises[0]

  logger.info("Getting the completion")
  const exerciseCompleteds = await prisma.exerciseCompletion.findMany({
    take: 1,
    where: {
      exercise: {
        custom_id: message.exercise_id,
      },
      user: { upstream_id: Number(message.user_id) },
    },
    orderBy: { timestamp: "desc" },
  })
  const exerciseCompleted = exerciseCompleteds[0]

  // @ts-ignore: value not used
  let savedExerciseCompletion: ExerciseCompletion

  if (!exerciseCompleted) {
    logger.info("No previous completion, creating a new one")
    savedExerciseCompletion = await prisma.exerciseCompletion.create({
      data: {
        exercise: {
          connect: { id: exercise.id },
        },
        user: {
          connect: { upstream_id: Number(message.user_id) },
        },
        n_points: message.n_points,
        completed: message.completed,
        exercise_completion_required_actions: {
          create: message.required_actions.map((ra) => {
            return {
              value: ra,
            }
          }),
        },
        timestamp: message.timestamp,
      },
    })
  } else {
    logger.info("Updating previous completion")
    const oldTimestamp = DateTime.fromISO(
      exerciseCompleted?.timestamp?.toISOString() ?? "",
    )
    if (timestamp <= oldTimestamp) {
      return ok("Timestamp older than in DB, aborting")
    }
    savedExerciseCompletion = await prisma.exerciseCompletion.update({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        completed: message.completed,
        exercise_completion_required_actions: {
          create: message.required_actions.map((ra) => {
            return {
              value: ra,
            }
          }),
        },
        timestamp: message.timestamp,
      },
    })
  }
  await CheckCompletion(user, course)

  return ok("Saved to DB successfully")
}
