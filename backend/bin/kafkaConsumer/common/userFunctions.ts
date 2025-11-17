import {
  Course,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
  User,
  UserCourseServiceProgress,
} from "@prisma/client"

import {
  completionLanguageMap,
  LanguageAbbreviation,
} from "../../../config/languageConfig"
import { BaseContext } from "../../../context"
import { DatabaseInputError } from "../../../lib/errors"
import {
  emptyOrNullToUndefined,
  ensureDefinedArray,
  isNullish,
} from "../../../util"
import {
  ExerciseCompletionPart,
  ServiceProgressPartType,
  ServiceProgressType,
} from "./userCourseProgress/interfaces"

interface WithBaseContext {
  context: BaseContext
}

interface GetCombinedUserCourseProgressArgs extends WithBaseContext {
  user: User
  course: Course
}

export const getCombinedUserCourseProgress = async ({
  user,
  course,
  context: { prisma },
}: GetCombinedUserCourseProgressArgs): Promise<CombinedUserCourseProgress> => {
  const userCourseServiceProgresses =
    (await prisma.user
      .findUnique({ where: { id: user.id } })
      .user_course_service_progresses({
        where: {
          course_id: course.id,
        },
        distinct: ["course_id", "service_id"],
        orderBy: { created_at: "asc" },
      })) ?? []

  /*
   * Get rid of everything we dont neeed. After this the array looks like this:
   * [(serviceProgress)[[part1],[part2], ...], (anotherServiceProgress)[part1], [part2], ...]
   * It is still 2-dimensional!
   */
  const progresses: ServiceProgressType[] = userCourseServiceProgresses.map(
    (entry: UserCourseServiceProgress) => entry.progress as any, // type error otherwise
  )

  const combined = new CombinedUserCourseProgress()
  progresses.forEach((entry) => {
    const entries = ensureDefinedArray(entry)

    entries.forEach((p: ServiceProgressPartType) => {
      combined.addProgress(p)
    })
  })

  return combined
}

interface CheckRequiredExerciseCompletionsArgs extends WithBaseContext {
  user: User
  course: Course
}

export const checkRequiredExerciseCompletions = async ({
  user,
  course,
  context: { knex },
}: CheckRequiredExerciseCompletionsArgs): Promise<boolean> => {
  if (course.exercise_completions_needed) {
    const exercise_completions = await knex("exercise_completion")
      .countDistinct("exercise_completion.exercise_id")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", course.id)
      .andWhere("exercise_completion.user_id", user.id)
      .andWhere("exercise_completion.completed", true)
      .andWhereNot("exercise.deleted", true)

    return (
      Number(exercise_completions[0].count) >=
      course.exercise_completions_needed
    )
  }
  return true
}

interface GetExerciseCompletionsForCoursesArgs extends WithBaseContext {
  user: User
  courseIds: string[]
}

export const getExerciseCompletionsForCourses = async ({
  user,
  courseIds,
  context: { knex },
}: GetExerciseCompletionsForCoursesArgs) => {
  // picks only one exercise completion per exercise/user:
  // the one with the latest timestamp and latest updated_at
  const exercise_completions = await knex("exercise_completion as ec")
    .select<Array<ExerciseCompletionPart>>(
      "course_id",
      "custom_id",
      "max_points",
      "exercise_id",
      "n_points",
    )
    .distinctOn("ec.exercise_id")
    .join("exercise as e", { "ec.exercise_id": "e.id" })
    .where("ec.user_id", user.id)
    .whereIn("e.course_id", courseIds)
    .andWhere("ec.completed", true)
    .andWhereNot("e.deleted", true)
    .orderBy([
      "ec.exercise_id",
      { column: "ec.timestamp", order: "desc" },
      { column: "ec.updated_at", order: "desc" },
    ])
  /*
    [{ course_id, custom_id, exercise_id, max_points, n_points }, ...]
   */
  return exercise_completions // ?.rows ?? []
}

interface PruneDuplicateExerciseCompletionsArgs extends WithBaseContext {
  user_id: string
  course_id: string
}

export const pruneDuplicateExerciseCompletions = async ({
  user_id,
  course_id,
  context: { knex },
}: PruneDuplicateExerciseCompletionsArgs) => {
  // variation: only prune those with the latest timestamp but older updated_at
  /*const deleted: Array<Pick<ExerciseCompletion, "id">> = await knex(
    "exercise_completion",
  )
    .whereIn(
      "id",
      knex("exercise_completion as ec")
        .select("ec.id")
        .join(
          knex("exercise_completion as ec2")
            .select(["ec2.id", "user_id", "exercise_id", "ec2.timestamp"])
            .distinctOn("user_id", "exercise_id")
            .join("exercise as e", { "e.id": "ec2.exercise_id" })
            .where("ec2.user_id", user_id)
            .andWhere("e.course_id", course_id)
            .orderBy([
              "user_id",
              "exercise_id",
              { column: "ec2.timestamp", order: "desc" },
              { column: "ec2.updated_at", order: "desc" },
            ])
            .as("s"),
          function () {
            this.on("s.user_id", "ec.user_id")
            this.on("s.exercise_id", "ec.exercise_id")
            this.on("s.timestamp", "ec.timestamp")
          },
        )
        .where("ec.user_id", user_id)
        .andWhereNot("ec.id", knex.ref("s.id")),
    )
    .delete()
    .returning("id")*/

  // we probably can just delete all even if they have required actions
  const deleted = await knex("exercise_completion")
    .whereIn(
      "id",
      knex
        .select("id")
        .from(
          knex("exercise_completion as ec")
            .select([
              "ec.id",
              knex.raw(
                `row_number() OVER (PARTITION BY exercise_id, ec.timestamp ORDER BY ec.timestamp DESC, ec.updated_at DESC) rn`,
              ),
            ])
            //.countDistinct("ecra.value as action_count")
            .join("exercise as e", { "ec.exercise_id": "e.id" })
            //.leftJoin("exercise_completion_required_actions as ecra", {
            //"ecra.exercise_completion_id": "ec.id",
            //})
            .where("ec.user_id", user_id)
            .andWhere("e.course_id", course_id)
            .groupBy("ec.id")
            .as("s"),
        )
        .where("rn", ">", "1"),
      //.andWhere("action_count", "=", 0),
    )
    .delete()
    .returning<Array<Pick<ExerciseCompletion, "id">>>("id")

  return deleted
}

export const pruneOrphanedExerciseCompletionRequiredActions = async ({
  context: { knex },
}: WithBaseContext) => {
  const deleted = await knex("exercise_completion_required_actions")
    .whereNull("exercise_completion_id")
    .delete()
    .returning<Array<Pick<ExerciseCompletionRequiredAction, "id">>>("id")

  return deleted
}

interface CheckCompletionArgs extends WithBaseContext {
  user: User
  course: Course
  handler?: Course | null
  combinedProgress?: CombinedUserCourseProgress
}

export const checkCompletion = async ({
  user,
  course,
  handler,
  combinedProgress,
  context,
}: CheckCompletionArgs) => {
  let combined = combinedProgress

  const handlerCourse = handler ?? course

  if (!combined) {
    combined = await getCombinedUserCourseProgress({ user, course, context })
  }

  const hasRequiredExerciseCompletions = await checkRequiredExerciseCompletions(
    {
      user,
      course,
      context,
    },
  )

  if (
    handlerCourse.automatic_completions &&
    combined.total_n_points >= (course.points_needed ?? 9999999) &&
    hasRequiredExerciseCompletions
  ) {
    await createCompletion({
      user,
      course,
      handler,
      context,
    })
  }
}

interface CreateCompletionArgs extends WithBaseContext {
  user: User
  course: Course
  handler?: Course | null
  tier?: number
}

export const createCompletion = async ({
  user,
  course,
  handler,
  context,
  tier,
}: CreateCompletionArgs) => {
  const { logger, prisma } = context

  const userCourseSettings = await prisma.user.findUserCourseSettings({
    where: {
      user_id: user.id,
      course_id: course.id,
    },
  })

  const handlerCourse = handler ?? course

  let completions =
    (await prisma.user
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
      })) ?? []

  // take course instance language first; then from user course settings
  const languageAbbrevation = course?.language ?? userCourseSettings?.language
  const completionLanguage =
    completionLanguageMap[languageAbbrevation as LanguageAbbreviation] ?? null

  // Filter out completions in other languages using the mapped language value
  completions = completions.filter(
    (c) =>
      c.completion_language === completionLanguage ||
      c.completion_language === languageAbbrevation,
  )

  if (completions.length < 1) {
    logger.info("No existing completion found, creating new...")

    const newCompletion = await prisma.completion.create({
      data: {
        course: { connect: { id: handlerCourse.id } },
        email: user.email,
        user: { connect: { id: user.id } },
        user_upstream_id: user.upstream_id,
        student_number: user.student_number,
        completion_language: completionLanguage,
        eligible_for_ects:
          tier === 1
            ? false
            : handlerCourse.automatic_completions_eligible_for_ects,
        completion_date: new Date(),
        tier: emptyOrNullToUndefined(tier),
      },
    })

    if (languageAbbrevation && !completionLanguage) {
      logger.warn(
        `Didn't recognize language ${languageAbbrevation} for user_upstream_id ${user.upstream_id}, created completion with id ${newCompletion.id} anyway, completion_language is null`,
      )
    }

    // TODO: this only sends the completion email for the first tier completed

    if (course.completion_email_id) {
      await prisma.emailDelivery.create({
        data: {
          user_id: user.id,
          email_template_id: course.completion_email_id,
          sent: false,
          error: false,
        },
      })
    }
  } else if (!isNullish(tier)) {
    // TODO: prune extra completions here?
    const eligible_for_ects =
      tier === 1 ? false : handlerCourse.automatic_completions_eligible_for_ects
    try {
      const updated = await prisma.$queryRaw<Array<number>>`
        UPDATE
          completion
        SET tier=${tier}, eligible_for_ects=${eligible_for_ects}, updated_at=now()
        WHERE id=${completions[0].id}::uuid AND COALESCE(tier, 0) < ${tier}
        RETURNING tier;`
      if (updated.length > 0) {
        logger.info("Existing completion found, updated tier")
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
    const index = this.groupIndex(newProgress.group)
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
      this.progress[index].max_points > 0
        ? (this.progress[index].n_points || 0) / this.progress[index].max_points
        : 0
  }
}

// languages moved to /backend/config/languageConfig.ts
