import { Message } from "./interfaces"
import { PrismaClient, ExerciseCompletion, User } from "@prisma/client"
import { DateTime } from "luxon"
import winston = require("winston")
import { CheckCompletion } from "../common/userCourseProgress/generateUserCourseProgress"
import knex from "knex"
import getUserFromTMC from "../common/getUserFromTMC"
import { ok, err, Result } from "../../../util/result"
import { DatabaseInputError, TMCError } from "../../lib/errors"
import { convertUpdate } from "../../../util/db-functions"

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
  logger.info("Handling message: " + JSON.stringify(message))
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
        logger.error(new TMCError(`couldn't find user ${message.user_id}`, e))
        throw e
      }
      logger.info("Mitigated race condition with user imports")
    }
  }

  const course = await prisma.course.findOne({
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

  logger.info("Getting the exercise")
  const exercise = await prisma.exercise.findFirst({
    where: {
      custom_id: message.exercise_id?.toString(),
    },
  })

  if (!exercise) {
    return err(
      new DatabaseInputError(
        `Given exercise does not exist: id ${message.exercise_id}`,
        message,
      ),
    )
  }

  logger.info("Getting the completion")
  const exerciseCompleted = await prisma.exerciseCompletion.findFirst({
    where: {
      exercise: {
        custom_id: message.exercise_id?.toString(),
      },
      user: { upstream_id: Number(message.user_id) },
    },
    orderBy: { timestamp: "desc" },
  })

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
        attempted: message.attempted !== null ? message.attempted : undefined,
        timestamp: timestamp.toJSDate(),
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
      data: convertUpdate({
        n_points: Number(message.n_points),
        completed: message.completed,
        exercise_completion_required_actions: {
          create: message.required_actions.map((ra) => {
            return {
              value: ra,
            }
          }),
        },
        attempted: message.attempted !== null ? message.attempted : undefined,
        timestamp: timestamp.toJSDate(),
      }),
    })
  }
  await CheckCompletion(user, course)

  return ok("Saved to DB successfully")
}
