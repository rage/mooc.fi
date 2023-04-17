import { DateTime } from "luxon"

import {
  Exercise,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
  Prisma,
} from "@prisma/client"

import {
  DatabaseInputError,
  TimestampWarning,
  ValidationError,
} from "../../../../lib/errors"
import { isNullOrUndefined } from "../../../../util/isNullOrUndefined"
import { err, ok, Result } from "../../../../util/result"
import { parseTimestamp } from "../../util"
import { KafkaContext } from "../kafkaContext"
import { Message } from "./interfaces"

interface ExerciseCompletionData {
  timestamp: DateTime
  exercise: Exercise
  exerciseCompletions: Array<
    ExerciseCompletion & {
      exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>
    }
  >
}

export const getExerciseAndCompletions = async <
  M extends { exercise_id: string; user_id: number },
>(
  { logger, prisma }: KafkaContext,
  message: M,
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

export const getCreatedAndUpdatedExerciseCompletions = async <
  M extends { course_id: string; user_id: number; exercises: Array<Message> },
>(
  { logger, prisma }: KafkaContext,
  message: M,
) => {
  const { exercises } = message
  logger.info("Getting the exercises")

  const messagesWithoutExerciseId = exercises.filter((m) =>
    isNullOrUndefined(m.exercise_id),
  )
  if (messagesWithoutExerciseId.length > 0) {
    return err(
      new ValidationError(
        "Messages do not contain an exercise id",
        messagesWithoutExerciseId,
      ),
    )
  }

  const messageIds = exercises.map((m) => m.exercise_id)
  const existingExercises = await prisma.exercise.findMany({
    where: {
      custom_id: { in: messageIds },
    },
  })
  const exerciseCustomIdToId = existingExercises.reduce(
    (acc, curr) => ({ ...acc, [curr.custom_id]: curr.id }),
    {} as Record<string, string>,
  )
  const missingExerciseIds = messageIds.filter(
    (id) => !(id in exerciseCustomIdToId),
  )

  if (missingExerciseIds.length > 0) {
    return err(
      new DatabaseInputError(
        `Given exercises do not exist`,
        missingExerciseIds,
      ),
    )
  }

  const wrongCourseIds = existingExercises
    .filter((e) => e.course_id !== message.course_id)
    .map((e) => e.custom_id)

  if (wrongCourseIds.length > 0) {
    return err(
      new DatabaseInputError(
        `Given exercises do not belong to the given course`,
        wrongCourseIds,
      ),
    )
  }

  const exerciseIds = existingExercises.map((e) => e.id)

  logger.info("Getting the exercise completions")
  const exerciseCompletions = await prisma.user
    .findUnique({
      where: {
        upstream_id: Number(message.user_id),
      },
    })
    .exercise_completions({
      where: {
        exercise_id: { in: exerciseIds },
      },
      distinct: ["exercise_id"],
      orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
      include: {
        exercise_completion_required_actions: true,
      },
    })

  const existingCompletedExercises = exerciseCompletions.map(
    (ec) => ec.exercise_id,
  )
  const createdExercises = existingExercises.filter(
    (e) => !existingCompletedExercises.includes(e.id),
  )
  const createdExerciseCustomIds = createdExercises.map((e) => e.custom_id)
  const created = exercises
    .filter((e) => createdExerciseCustomIds.includes(e.exercise_id))
    .map((e) => ({
      message: e,
      exercise_id: exerciseCustomIdToId[e.exercise_id],
    }))
  const updated = exercises
    .filter((e) => !createdExerciseCustomIds.includes(e.exercise_id))
    .map((e) => ({
      message: e,
      exerciseCompletions: exerciseCompletions.filter(
        (ec) => ec.exercise_id === exerciseCustomIdToId[e.exercise_id],
      ),
    }))

  return ok([created, updated] as const)
}

export const createExerciseCompletion = async (
  context: KafkaContext,
  message: Message,
  data: {
    timestamp: DateTime
    exercise_id: string
  },
) => {
  const { logger, prisma } = context
  const { timestamp, exercise_id } = data
  const required_actions = message.completed ? [] : message.required_actions

  logger.info("No previous exercise completion, creating a new one")
  let originalSubmissionDate: DateTime | null = null

  if (message.original_submission_date) {
    try {
      originalSubmissionDate = parseTimestamp(message.original_submission_date)
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

  let savedExerciseCompletion: ExerciseCompletion

  const exerciseCompletionCreateInputData: Prisma.ExerciseCompletionCreateInput =
    {
      exercise: {
        connect: { id: exercise_id },
      },
      user: {
        connect: { upstream_id: Number(message.user_id) },
      },
      n_points: Number(message.n_points),
      completed: message.completed,
      attempted: message.attempted !== null ? message.attempted : false,
      exercise_completion_required_actions: {
        create: required_actions.map((value) => ({ value })),
      },
      timestamp: timestamp.toJSDate(),
      original_submission_date: originalSubmissionDate?.toJSDate(),
    }
  logger.info(`Inserting ${JSON.stringify(exerciseCompletionCreateInputData)}`)
  try {
    savedExerciseCompletion = await prisma.exerciseCompletion.create({
      data: exerciseCompletionCreateInputData,
    })
    return ok(savedExerciseCompletion)
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(
        `Inserting exercise completion failed ${e.name}: ${e.message}`,
      )
      return err(e)
    } else {
      logger.warn(`Inserting exercise completion failed: ${String(e)}`)
      return err(new DatabaseInputError(String(e)))
    }
  }
}

export const updateExerciseCompletion = async (
  context: KafkaContext,
  message: Message,
  data: {
    timestamp: DateTime
    exerciseCompletions: Array<
      ExerciseCompletion & {
        exercise_completion_required_actions: Array<ExerciseCompletionRequiredAction>
      }
    >
  },
) => {
  const { logger, prisma } = context
  const { timestamp, exerciseCompletions } = data
  const required_actions = message.completed ? [] : message.required_actions

  const exerciseCompleted = exerciseCompletions[0]
  const existingActionsOnNewestExerciseCompletion =
    exerciseCompleted.exercise_completion_required_actions

  logger.info("Updating previous exercise completion")
  const oldTimestamp = DateTime.fromISO(
    exerciseCompleted?.timestamp?.toISOString() ?? "",
  )

  // TODO: should we remove the actions if the timestamp is older?
  if (timestamp <= oldTimestamp) {
    return ok(new TimestampWarning("Timestamp older than in DB, aborting"))
  }

  const existingActionValues =
    existingActionsOnNewestExerciseCompletion?.map((ea) => ea.value) ?? []
  const createActions = required_actions
    .filter((ra) => !existingActionValues.includes(ra))
    .map((value) => ({ value }))
  const deletedActions = existingActionsOnNewestExerciseCompletion.filter(
    (ea) => !required_actions.includes(ea.value),
  )

  let savedExerciseCompletion: ExerciseCompletion

  try {
    savedExerciseCompletion = await prisma.exerciseCompletion.update({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        completed: { set: message.completed },
        attempted: {
          set: message.attempted !== null ? message.attempted : false,
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
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(`Updating exercise completion failed ${e.name}: ${e.message}`)
      return err(e)
    } else {
      logger.warn(`Updating exercise completion failed: ${String(e)}`)
      return err(new DatabaseInputError(String(e)))
    }
  }

  return ok(savedExerciseCompletion)
}

export const pruneExerciseCompletions = async (
  context: KafkaContext,
  exerciseCompletions: ExerciseCompletionData["exerciseCompletions"],
) => {
  const { logger, prisma } = context
  const exerciseCompleted = exerciseCompletions[0]
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
    try {
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
      return ok({ pruned, prunedActions })
    } catch (e) {
      if (e instanceof Error) {
        logger.warn(
          `Pruning duplicate exercise completions failed ${e.name}: ${e.message}`,
        )
        return err(e)
      } else {
        logger.warn(
          `Pruning duplicate exercise completions failed: ${String(e)}`,
        )
        return err(new DatabaseInputError(String(e)))
      }
    }
  }
  return ok({})
}
