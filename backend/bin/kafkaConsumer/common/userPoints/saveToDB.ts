import { Message } from "./interfaces"
import { ExerciseCompletion, User } from "@prisma/client"
import { DateTime } from "luxon"
import { checkCompletion } from "../userCourseProgress/userFunctions"
import getUserFromTMC from "../getUserFromTMC"
import { ok, err, Result } from "../../../../util/result"
import { DatabaseInputError, TMCError } from "../../../lib/errors"
import { KafkaContext } from "../kafkaContext"
import type Knex from "knex"

// @ts-ignore: not used
const isUserInDB = async (user_id: number, knex: Knex) => {
  return await knex("user").where("upstream_id", "=", user_id)
}

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { logger, prisma } = context

  logger.info("Handling message: " + JSON.stringify(message))
  logger.info("Parsing timestamp")
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  logger.info(`Checking if user ${message.user_id} exists.`)

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
    take: 1,
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
    const data = {
      exercise: {
        connect: { id: exercise.id },
      },
      user: {
        connect: { upstream_id: Number(message.user_id) },
      },
      n_points: Number(message.n_points),
      completed: message.completed,
      attempted: message.attempted !== null ? message.attempted : undefined,
      exercise_completion_required_actions: {
        create: message.required_actions.map((ra) => {
          return {
            value: ra,
          }
        }),
      },
      timestamp: timestamp.toJSDate(),
    }
    logger.info(`Inserting ${JSON.stringify(data)}`)
    try {
      savedExerciseCompletion = await prisma.exerciseCompletion.create({
        data,
      })
    } catch (e) {
      if (e instanceof Error) {
        logger.warn(
          `Inserting exercise completion failed ${e.name}: ${e.message}`,
        )
      }
    }
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
        completed: { set: message.completed },
        attempted: {
          set: message.attempted !== null ? message.attempted : undefined,
        },
        exercise_completion_required_actions: {
          create: message.required_actions.map((ra) => {
            return {
              value: ra,
            }
          }),
        },
        timestamp: { set: timestamp.toJSDate() },
      },
    })
  }
  await checkCompletion({ user, course, context })

  return ok("Saved to DB successfully")
}
