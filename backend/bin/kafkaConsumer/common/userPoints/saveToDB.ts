import { ok } from "../../../../util/result"
import { KafkaContext } from "../kafkaContext"
import { checkCompletion } from "../userFunctions"
import {
  createExerciseCompletion,
  getExerciseAndCompletions,
  pruneExerciseCompletions,
  updateExerciseCompletion,
} from "./exerciseCompletionFunctions"
import { Message } from "./interfaces"
import { getCourse, getTimestamp, getUser } from "./util"

export const saveToDatabase = async (
  context: KafkaContext,
  message: Message,
) => {
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
  const maybeExerciseAndCompletions = await getExerciseAndCompletions(
    context,
    message,
  )
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
        exercise_id: exercise.id,
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
