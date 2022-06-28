import { UserInputError } from "apollo-server-express"
import { DateTime } from "luxon"

import { ExerciseCompletion } from "@prisma/client"

import { err, ok, Result } from "../../../../util/result"
import { DatabaseInputError } from "../../../lib/errors"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"
import { KafkaContext } from "../kafkaContext"
import { checkCompletion } from "../userCourseProgress/userFunctions"
import { Message } from "./interfaces"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
): Promise<Result<string, Error>> => {
  const { logger, prisma } = context

  logger.info("Handling message: " + JSON.stringify(message))
  logger.info("Parsing timestamp")
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  logger.info(`Checking if user ${message.user_id} exists`)

  const user = await getUserWithRaceCondition(context, message.user_id)

  const course = await prisma.course.findUnique({
    where: { id: message.course_id },
    include: {
      completions_handled_by: true,
    },
  })

  if (!user || !course) {
    return err(new DatabaseInputError(`Invalid user or course`, message))
  }

  logger.info("Getting the exercise")
  if (!message.exercise_id) {
    return err(
      new UserInputError("Message doesn't contain an exercise id", message),
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
        exercise: {
          id: exercise.id,
        },
      },
      orderBy: { timestamp: "desc", updated_at: "desc" },
      include: {
        exercise_completion_required_actions: true,
      },
    })

  // @ts-ignore: value not used
  let savedExerciseCompletion: ExerciseCompletion

  const required_actions = message.completed ? [] : message.required_actions

  // TODO:
  // when updating the exercise completion:
  // - we should check if there are any required actions attached to
  //   exercise completions other than the newest and attach them to the new one
  // - prune the extra exercise completions (would this then remove the actions as well?)
  // - if it's completed, we should remove all required actions

  /*const uniqueRequiredActionValuesAcrossAllCompletions = uniq(
    exerciseCompletions
      .filter((ec) => !ec.completed)
      .flatMap((ec) => ec.exercise_completion_required_actions?.map((a) => a.value))
      .filter(notEmpty)
  )*/

  if (exerciseCompletions.length === 0) {
    logger.info("No previous exercise completion, creating a new one")
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
        create: required_actions.map((value) => ({ value })),
      },
      timestamp: timestamp.toJSDate(),
      original_submission_date: message.original_submission_date
        ? DateTime.fromISO(message.original_submission_date).toJSDate()
        : null,
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
    const exerciseCompleted = exerciseCompletions[0]

    logger.info("Updating previous exercise completion")
    const oldTimestamp = DateTime.fromISO(
      exerciseCompleted?.timestamp?.toISOString() ?? "",
    )

    // TODO: should we remove the actions if the timestamp is older?
    if (timestamp <= oldTimestamp) {
      return ok("Timestamp older than in DB, aborting")
    }

    const existingActions =
      exerciseCompleted.exercise_completion_required_actions
    const existingActionValues = existingActions?.map((ea) => ea.value) ?? []
    const createActions = required_actions
      .filter((ra) => !existingActionValues.includes(ra))
      .map((value) => ({ value }))
    const deletedActions = existingActions.filter(
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
  }
  await checkCompletion({
    user,
    course,
    handler: course.completions_handled_by,
    context,
  })

  return ok("Saved to DB successfully")
}
