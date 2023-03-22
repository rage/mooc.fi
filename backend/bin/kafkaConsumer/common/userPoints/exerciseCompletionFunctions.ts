import { DateTime } from "luxon"

import {
  Exercise,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
  Prisma,
} from "@prisma/client"

import { DatabaseInputError, TimestampWarning } from "../../../../lib/errors"
import { err, ok } from "../../../../util/result"
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

export const createExerciseCompletion = async (
  context: KafkaContext,
  message: Message,
  data: {
    timestamp: DateTime
    exercise: Exercise
  },
) => {
  const { logger, prisma } = context
  const { timestamp, exercise } = data
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
