import { ok } from "../../../../util/result"
import { KafkaContext } from "../kafkaContext"
import { checkCompletion } from "../userFunctions"
import {
  createExerciseCompletion,
  getCreatedAndUpdatedExerciseCompletions,
  pruneExerciseCompletions,
  updateExerciseCompletion,
} from "../userPoints/exerciseCompletionFunctions"
import { getCourse, getTimestamp, getUser } from "../userPoints/util"
import { Message } from "./interfaces"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
) => {
  const { logger } = context

  logger.info("Handling message: " + JSON.stringify(message))
  const maybeTimestamp = getTimestamp(context, message)
  if (maybeTimestamp.isErr()) {
    return maybeTimestamp
  }
  const maybeUser = await getUser(context, message)
  if (maybeUser.isErr()) {
    return maybeUser
  }
  const maybeCourse = await getCourse(context, message)
  if (maybeCourse.isErr()) {
    return maybeCourse
  }
  const maybeCreatedAndUpdatedExerciseCompletions =
    await getCreatedAndUpdatedExerciseCompletions(context, message)

  if (maybeCreatedAndUpdatedExerciseCompletions.isErr()) {
    return maybeCreatedAndUpdatedExerciseCompletions
  }
  const timestamp = maybeTimestamp.value
  const user = maybeUser.value
  const course = maybeCourse.value
  const [created, updated] = maybeCreatedAndUpdatedExerciseCompletions.value

  for (const { message: exerciseMessage, exercise_id } of created) {
    const exerciseCompletionCreateResult = await createExerciseCompletion(
      context,
      exerciseMessage,
      {
        timestamp,
        exercise_id,
      },
    )
    if (exerciseCompletionCreateResult.isErr()) {
      return exerciseCompletionCreateResult
    }
  }

  for (const { message: exerciseMessage, exerciseCompletions } of updated) {
    const exerciseCompletionUpdateResult = await updateExerciseCompletion(
      context,
      exerciseMessage,
      {
        timestamp,
        exerciseCompletions,
      },
    )

    if (exerciseCompletionUpdateResult.isErr()) {
      return exerciseCompletionUpdateResult
    }
    if (exerciseCompletionUpdateResult.isWarning()) {
      logger.warn(exerciseCompletionUpdateResult.value.message)

      continue
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
