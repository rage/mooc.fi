import {
  Course,
  User,
  UserCourseServiceProgress,
  UserCourseSetting,
} from "@prisma/client"

import {
  completionLanguageMap,
  LanguageAbbreviation,
} from "../../../../config/languageConfig"
import { isNullOrUndefined } from "../../../../util/isNullOrUndefined"
import { MessageType, pushMessageToClient } from "../../../../wsServer"
import { DatabaseInputError } from "../../../lib/errors"
import { KafkaContext } from "../kafkaContext"
import {
  ExerciseCompletionPart,
  ServiceProgressPartType,
  ServiceProgressType,
} from "./interfaces"

export const getCombinedUserCourseProgress = async ({
  user,
  course,
  context: { prisma },
}: {
  user: User
  course: Course
  context: KafkaContext
}): Promise<CombinedUserCourseProgress> => {
  /* Get UserCourseServiceProgresses */
  const baseQuery = user?.id
    ? prisma.user.findUnique({ where: { id: user.id } })
    : course?.id
    ? prisma.course.findUnique({ where: { id: course.id } })
    : null
  if (!baseQuery) {
    throw new Error("has to have at least one of user and course")
  }
  const userCourseServiceProgresses =
    await baseQuery.user_course_service_progresses({
      where: {
        user_id: user?.id,
        course_id: course?.id,
      },
    })

  /*
   * Get rid of everything we dont neeed. After this the array looks like this:
   * [(serviceProgress)[[part1],[part2], ...], (anotherServiceProgress)[part1], [part2], ...]
   * It is still 2-dimensional!
   */
  const progresses: ServiceProgressType[] = userCourseServiceProgresses.map(
    (entry: UserCourseServiceProgress) => entry.progress as any, // type error otherwise
  )

  let combined = new CombinedUserCourseProgress()
  progresses.forEach((entry) => {
    const entries = Array.isArray(entry) ? entry : [entry]

    entries.forEach((p: ServiceProgressPartType) => {
      combined.addProgress(p)
    })
  })

  return combined
}

export const checkRequiredExerciseCompletions = async ({
  user,
  course,
  context: { knex },
}: {
  user: User
  course: Course
  context: KafkaContext
}): Promise<boolean> => {
  if (course.exercise_completions_needed) {
    // TODO/FIXME: skip deleted exercises?
    const exercise_completions = await knex("exercise_completion")
      .countDistinct("exercise_completion.exercise_id")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", course.id)
      .andWhere("exercise_completion.user_id", user.id)
      .andWhere("exercise_completion.completed", true)
      .andWhereNot("exercise.max_points", 0)

    return exercise_completions[0].count >= course.exercise_completions_needed
  }
  return true
}

export const getExerciseCompletionsForCourses = async ({
  user,
  courseIds,
  context: { knex },
}: {
  user: User
  courseIds: string[]
  context: KafkaContext
}) => {
  // TODO/FIXME: skip deleted exercises?
  const exercise_completions: ExerciseCompletionPart[] = await knex<
    any,
    ExerciseCompletionPart[]
  >("exercise_completion")
    .select(
      "exercise.course_id",
      "exercise.custom_id",
      "exercise.max_points",
      "exercise_completion.exercise_id",
      "exercise_completion.n_points",
    )
    .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
    .whereIn("exercise.course_id", courseIds)
    .andWhere("exercise_completion.user_id", user.id)
    .andWhere("exercise_completion.completed", true)
    .andWhereNot("exercise.max_points", 0)

  /*
    [{ course_id, custom_id, exercise_id, max_points, n_points }, ...]
   */
  return exercise_completions
}

export const getUserCourseSettings = async ({
  user_id,
  course_id,
  context: { prisma },
}: {
  user_id: string
  course_id: string
  context: KafkaContext
}): Promise<UserCourseSetting | null> => {
  // - if the course inherits user course settings from some course, get settings from that one
  // - if not, get if from the course itself or null if none exists
  const result = await prisma.course.findUnique({
    where: {
      id: course_id,
    },
    include: {
      user_course_settings: {
        where: {
          user_id,
        },
        orderBy: {
          created_at: "asc",
        },
      },
      inherit_settings_from: {
        include: {
          user_course_settings: {
            where: {
              user_id,
            },
            orderBy: {
              created_at: "asc",
            },
          },
        },
      },
    },
  })

  return (
    result?.inherit_settings_from?.user_course_settings?.[0] ??
    result?.user_course_settings?.[0] ??
    null
  )
}

interface CheckCompletion {
  user: User
  course: Course
  combinedProgress?: CombinedUserCourseProgress
  context: KafkaContext
}

export const checkCompletion = async ({
  user,
  course,
  combinedProgress,
  context,
}: CheckCompletion) => {
  const { prisma } = context

  let combined = combinedProgress

  if (!combined) {
    combined = await getCombinedUserCourseProgress({ user, course, context })
  }

  const requiredExerciseCompletions = await checkRequiredExerciseCompletions({
    user,
    course,
    context,
  })
  if (
    course.automatic_completions &&
    combined.total_n_points >= (course.points_needed ?? 9999999) &&
    requiredExerciseCompletions
  ) {
    let handlerCourse = course

    const otherHandlerCourse = await prisma.course
      .findUnique({ where: { id: course.id } })
      .completions_handled_by()

    if (otherHandlerCourse) {
      handlerCourse = otherHandlerCourse
    }

    await createCompletion({
      user,
      course_id: course.id,
      handlerCourse: handlerCourse,
      context,
    })
  }
}

interface CreateCompletion {
  user: User
  course_id: string
  handlerCourse: Course
  tier?: number
  context: KafkaContext
}

export const createCompletion = async ({
  user,
  course_id,
  handlerCourse,
  context,
  tier,
}: CreateCompletion) => {
  const { logger, prisma } = context

  const userCourseSettings = await getUserCourseSettings({
    user_id: user.id,
    course_id,
    context,
  })

  const completions = await prisma.user
    .findUnique({
      where: {
        id: user.id,
      },
    })
    .completions({
      where: {
        course_id: handlerCourse.id,
      },
      orderBy: {
        created_at: "asc",
      },
    })

  if (completions.length < 1) {
    logger.info("No existing completion found, creating new...")

    const { language } = userCourseSettings ?? {}
    const completion_language =
      completionLanguageMap[language as LanguageAbbreviation] ?? null

    const newCompletion = await prisma.completion.create({
      data: {
        course: { connect: { id: handlerCourse.id } },
        email: user.email,
        user: { connect: { id: user.id } },
        user_upstream_id: user.upstream_id,
        student_number: user.student_number,
        completion_language,
        eligible_for_ects:
          tier === 1
            ? false
            : handlerCourse.automatic_completions_eligible_for_ects,
        completion_date: new Date(),
        tier: !isNullOrUndefined(tier) ? tier : undefined,
      },
    })

    if (!userCourseSettings) {
      logger.warn(
        `No user course settings found for user ${user.id} on course ${course_id} (handler ${handlerCourse.id}), created completion ${newCompletion.id} anyway; completion_language will be null`,
      )
    } else if (language && !completion_language) {
      logger.warn(
        `Didn't recognize language ${language} for user_upstream_id ${user.upstream_id}, created completion with id ${newCompletion.id} anyway`,
      )
    }

    // TODO: this only sends the completion email for the first tier completed
    await pushMessageToClient(
      user.upstream_id,
      course_id,
      MessageType.COURSE_CONFIRMED,
    )

    const template = await prisma.course
      .findUnique({ where: { id: course_id } })
      .completion_email()

    if (template) {
      await prisma.emailDelivery.create({
        data: {
          user_id: user.id,
          email_template_id: template.id,
          sent: false,
          error: false,
        },
      })
    }
  } else if (!isNullOrUndefined(tier)) {
    const eligible_for_ects =
      tier === 1 ? false : handlerCourse.automatic_completions_eligible_for_ects
    try {
      const updated = await prisma.$queryRaw(
        `
        UPDATE
          completion 
        SET tier=$1, eligible_for_ects=$2, updated_at=now()
        WHERE id=$3 AND COALESCE(tier, 0) < $1
        RETURNING tier;`,
        tier,
        eligible_for_ects,
        completions[0]!.id,
      )
      if (updated.length > 0) {
        logger?.info("Existing completion found, updated tier")
      }
    } catch (error: any) {
      logger.error(
        new DatabaseInputError("Error updating tier", completions[0], error),
      )
    }
  }
}

export class CombinedUserCourseProgress {
  public progress: ServiceProgressPartType[] = []
  public total_max_points = 0
  public total_n_points = 0

  public addProgress(newProgress: ServiceProgressPartType) {
    this.total_max_points += newProgress.max_points
    this.total_n_points += newProgress.n_points
    let index = this.groupIndex(newProgress.group)
    if (index < 0) {
      this.progress.push(newProgress)
    } else {
      this.addToExistingProgress(newProgress, index)
    }
  }

  private groupIndex(part: string) {
    for (let i = 0; i < this.progress.length; i++) {
      if (this.progress[i].group == part) return i
    }
    return -1
  }

  private addToExistingProgress(
    progress: ServiceProgressPartType,
    index: number,
  ) {
    this.progress[index].max_points += progress.max_points
    this.progress[index].n_points += progress.n_points
    this.progress[index].progress =
      (this.progress[index].n_points || 0) /
      (this.progress[index].max_points || 1)
  }
}

// languages moved to /backend/config/languageConfig.ts
