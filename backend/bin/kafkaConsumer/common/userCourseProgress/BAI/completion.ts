import { Course, User } from "@prisma/client"

import { BAIbadge, BAItiers } from "../../../../../config/courseConfig"
import { BaseContext } from "../../../../../context"
import {
  createCompletion,
  getExerciseCompletionsForCourses,
} from "../../userFunctions"
import { getBAIProgress } from "./progress"

const checkBAIProjectCompletion = async (user: User, { knex }: BaseContext) => {
  const exerciseCompletions = await knex("exercise_completion")
    .select("exercise_completion.completed")
    .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
    .whereIn("exercise.custom_id", Object.keys(BAIbadge))
    .andWhere("exercise_completion.user_id", user.id)
    .andWhere("exercise_completion.completed", true)

  return exerciseCompletions.length > 0
}

interface CheckBAICompletionArgs {
  user: User
  course: Course
  handler?: Course | null
  context: BaseContext
}

export const checkBAICompletion = async ({
  user,
  course,
  handler,
  context,
}: CheckBAICompletionArgs) => {
  const { logger, prisma } = context

  logger.info("Getting exercise completions")
  const exerciseCompletionsForCourses = await getExerciseCompletionsForCourses({
    user,
    courseIds: Object.values(BAItiers), // tierCourses,
    context,
  })
  /*
    [{ course_id, exercise_id, n_points }...] for all the tiers
  */

  logger.info("Getting project completion")
  const projectCompletion = await checkBAIProjectCompletion(user, context)

  logger.info("Getting BAI course progress")
  const { progress: newProgress, highestTier } = getBAIProgress(
    projectCompletion,
    exerciseCompletionsForCourses,
  )

  // TODO: update project completion to all tier progresses?
  // TODO/FIXME: BAI should check progress from the _handler_ here,
  // even though the handler is in this case the completion handler course.
  // Add a separate progress_handled_by, even though that would only apply here
  // as the tiers have their own progress?
  const existingProgresses = await prisma.course
    .findUnique({
      where: { id: handler?.id ?? course.id },
    })
    .user_course_progresses({
      where: {
        user_id: user.id,
      },
      orderBy: { created_at: "asc" },
    })

  if (existingProgresses.length < 1) {
    logger.info("No existing progress found, creating new...")
    await prisma.userCourseProgress.create({
      data: {
        course: {
          connect: { id: handler?.id ?? course.id },
        },
        user: { connect: { id: user.id } },
        ...newProgress,
      },
    })
  } else {
    logger.info("Updating existing progress")
    await prisma.userCourseProgress.update({
      where: {
        id: existingProgresses[0].id,
      },
      data: newProgress,
    })
    if (existingProgresses.length > 1) {
      logger?.info("Pruning duplicate progresses")
      await prisma.userCourseProgress.deleteMany({
        where: {
          id: { in: existingProgresses.slice(1).map((ucp) => ucp.id) },
        },
      })
    }
  }

  if (highestTier < 1) {
    return
  }

  logger.info("Creating completion")

  const highestTierCourse = await prisma.course.findUnique({
    where: {
      id: BAItiers[highestTier],
    },
  })

  await createCompletion({
    user,
    course: highestTierCourse ?? course,
    handler,
    context,
    tier: highestTier,
  })
}
