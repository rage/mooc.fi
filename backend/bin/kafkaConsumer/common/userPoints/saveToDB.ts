import { DateTime } from "luxon"

import {
  Course,
  Exercise,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
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
import {
  createExerciseCompletion,
  pruneExerciseCompletions,
  updateExerciseCompletion,
} from "./exerciseCompletionFunctions"
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
  const { logger } = context

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

  if (exerciseCompletions.length === 0) {
    const exerciseCompletionCreateResult = await createExerciseCompletion(
      context,
      message,
      {
        timestamp,
        exercise,
      },
    )
    if (exerciseCompletionCreateResult.isErr()) {
      return exerciseCompletionCreateResult
    }
  } else {
    const exerciseCompletionUpdateResult = await updateExerciseCompletion(
      context,
      message,
      {
        timestamp,
        exerciseCompletions,
      },
    )

    if (
      exerciseCompletionUpdateResult.isErr() ||
      exerciseCompletionUpdateResult.isWarning()
    ) {
      return exerciseCompletionUpdateResult
    }
    const pruneExerciseCompletionsResult = await pruneExerciseCompletions(
      context,
      exerciseCompletions,
    )

    if (pruneExerciseCompletionsResult.isErr()) {
      // we do nothing as it isn't critical
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
