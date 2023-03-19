import { DateTime } from "luxon"

import {
  Course,
  Exercise,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
  Prisma,
  User,
} from "@prisma/client"

import {
  DatabaseInputError,
  TMCError,
  ValidationError,
} from "../../../../lib/errors"
import { err, ok, Result } from "../../../../util/result"
import { parseTimestamp } from "../../util"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"
import { KafkaContext } from "../kafkaContext"
import { checkCompletion } from "../userFunctions"
import { Message } from "./interfaces"

const getTimestamp = (
  { logger }: KafkaContext,
  message: Message,
): Result<DateTime, Error> => {
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

const getUser = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<User, Error>> => {
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

const getCourse = async (
  { prisma }: KafkaContext,
  message: Message,
): Promise<
  Result<Course & { completions_handled_by: Course | null }, Error>
> => {
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

const getExerciseAndCompletions = async (
  { logger, prisma }: KafkaContext,
  message: Message,
): Promise<
  Result<
    readonly [
      Exercise,
      Array<
        ExerciseCompletion & {
          exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>
        }
      >,
    ],
    Error
  >
> => {
  logger.info("Getting the exercise")
  if (!message.exercise_id) {
    return err(
      new ValidationError("Message doesn't contain an exercise id", message),
    )
  }

  const exercise = await prisma.exercise.findFirst({
    where: {
      custom_id: message.exercise_id.toString(),
    },
  })
  if (!exercise) {
    return err(new DatabaseInputError(`Given exercise does not exist`, message))
  }

  logger.info("Getting the exercise completion")
  const exerciseCompletions = await prisma.user
    .findUnique({
      where: {
        upstream_id: Number(message.user_id),
      },
    })
    .exercise_completions({
      where: {
        exercise_id: exercise.id,
      },
      orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
      include: {
        exercise_completion_required_actions: true,
      },
    })

  return ok([exercise, exerciseCompletions] as const)
}

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
) => {
  const { logger, prisma } = context

  logger.info("Handling message: " + JSON.stringify(message))
  const maybeTimestamp = getTimestamp(context, message)
  const maybeUser = await getUser(context, message)
  const maybeCourse = await getCourse(context, message)
  const maybeExerciseAndCompletions = await getExerciseAndCompletions(
    context,
    message,
  )

  if (maybeTimestamp.isErr()) {
    return maybeTimestamp
  }
  if (maybeUser.isErr()) {
    return maybeUser
  }
  if (maybeCourse.isErr()) {
    return maybeCourse
  }
  if (maybeExerciseAndCompletions.isErr()) {
    return maybeExerciseAndCompletions
  }
  const timestamp = maybeTimestamp.value
  const user = maybeUser.value
  const course = maybeCourse.value
  const [exercise, exerciseCompletions] = maybeExerciseAndCompletions.value

  // @ts-ignore: value not used
  let savedExerciseCompletion: ExerciseCompletion

  const required_actions = message.completed ? [] : message.required_actions

  if (exerciseCompletions.length === 0) {
    logger.info("No previous exercise completion, creating a new one")
    let originalSubmissionDate: DateTime | null = null

    if (message.original_submission_date) {
      try {
        originalSubmissionDate = parseTimestamp(
          message.original_submission_date,
        )
      } catch (e) {
        return err(
          new DatabaseInputError(
            "Invalid original submission date",
            message,
            e instanceof Error ? e : new Error(e as string),
          ),
        )
      }
    }

    const data: Prisma.ExerciseCompletionCreateInput = {
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
        create: required_actions.map((value) => ({ value })),
      },
      timestamp: timestamp.toJSDate(),
      original_submission_date: originalSubmissionDate?.toJSDate(),
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
      } else {
        logger.warn(`Inserting exercise completion failed: ${String(e)}`)
      }
    }
  } else {
    const exerciseCompleted = exerciseCompletions[0]
    const existingActionsOnNewestExerciseCompletion =
      exerciseCompleted.exercise_completion_required_actions

    logger.info("Updating previous exercise completion")
    const oldTimestamp = DateTime.fromISO(
      exerciseCompleted?.timestamp?.toISOString() ?? "",
    )

    // TODO: should we remove the actions if the timestamp is older?
    if (timestamp <= oldTimestamp) {
      return ok("Timestamp older than in DB, aborting")
    }

    const existingActionValues =
      existingActionsOnNewestExerciseCompletion?.map((ea) => ea.value) ?? []
    const createActions = required_actions
      .filter((ra) => !existingActionValues.includes(ra))
      .map((value) => ({ value }))
    const deletedActions = existingActionsOnNewestExerciseCompletion.filter(
      (ea) => !required_actions.includes(ea.value),
    )

    savedExerciseCompletion = await prisma.exerciseCompletion.update({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        completed: { set: message.completed },
        attempted: {
          set: message.attempted !== null ? message.attempted : undefined,
        },
        exercise_completion_required_actions: {
          create: createActions,
          deleteMany: deletedActions.map((da) => ({ id: da.id })),
        },
        timestamp: { set: timestamp.toJSDate() },
        original_submission_date: {
          set: message.original_submission_date
            ? DateTime.fromISO(message.original_submission_date).toJSDate()
            : null,
        },
      },
    })

    // TODO/FIXME: we could prune all the duplicate actions for this user/exercise combination?
    const exerciseCompletionsWithSameTimestamp = exerciseCompletions
      .filter((ec) => ec.id !== exerciseCompleted.id)
      .filter(
        (ec) =>
          ec.timestamp.toISOString() ===
          exerciseCompleted.timestamp.toISOString(),
      )
      .filter(
        (ec) =>
          (ec?.updated_at ?? new Date(0)) <=
          (exerciseCompleted?.updated_at ?? new Date(0)),
      )

    if (exerciseCompletionsWithSameTimestamp.length > 0) {
      logger.info(
        "Pruning duplicate exercise completions with same timestamp as the newest one",
      )
      const prunedActions =
        await prisma.exerciseCompletionRequiredAction.deleteMany({
          where: {
            exercise_completion_id: {
              in: exerciseCompletionsWithSameTimestamp.map((ec) => ec.id),
            },
          },
        })

      const pruned = await prisma.exerciseCompletion.deleteMany({
        where: {
          id: { in: exerciseCompletionsWithSameTimestamp.map((ec) => ec.id) },
        },
      })
      logger.info(
        `Pruned ${pruned.count} exercise completions and ${prunedActions.count} related required actions`,
      )
    }
  }

  await checkCompletion({
    user,
    course,
    handler: course.completions_handled_by,
    context,
  })

  return ok("Saved to DB successfully")
}
