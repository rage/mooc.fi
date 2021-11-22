import {
  Course,
  User,
  UserCourseServiceProgress,
  UserCourseSetting,
} from "@prisma/client"

import { isNullOrUndefined } from "../../../../util/isNullOrUndefined"
import { MessageType, pushMessageToClient } from "../../../../wsServer"
import { DatabaseInputError } from "../../../lib/errors"
import { sendEmailTemplateToUser } from "../EmailTemplater/sendEmailTemplate"
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
  const userCourseServiceProgresses = await prisma.userCourseServiceProgress.findMany(
    {
      where: {
        user_id: user?.id,
        course_id: course?.id,
      },
    },
  )

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
  user,
  course_id,
  context: { prisma },
}: {
  user: User
  course_id: string
  context: KafkaContext
}): Promise<UserCourseSetting | null> => {
  let userCourseSetting = await prisma.userCourseSetting.findFirst({
    where: {
      user_id: user.id,
      course_id,
    },
    orderBy: {
      created_at: "asc",
    },
  })

  if (!userCourseSetting) {
    const inheritCourse = await prisma.course
      .findUnique({ where: { id: course_id } })
      .inherit_settings_from()
    if (inheritCourse) {
      userCourseSetting = await prisma.userCourseSetting.findFirst({
        where: {
          user_id: user.id,
          course_id: inheritCourse.id,
        },
        orderBy: {
          created_at: "asc",
        },
      })
    }
  }

  return userCourseSetting
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
      handlerCourse,
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
    user,
    course_id,
    context,
  })
  const completions = await prisma.completion.findMany({
    where: {
      user_id: user.id,
      course_id: handlerCourse.id,
    },
    orderBy: {
      created_at: "asc",
    },
  })
  if (completions.length < 1) {
    logger?.info("No existing completion found, creating new...")
    await prisma.completion.create({
      data: {
        course: { connect: { id: handlerCourse.id } },
        email: user.email,
        user: { connect: { id: user.id } },
        user_upstream_id: user.upstream_id,
        student_number: user.student_number,
        completion_language: userCourseSettings?.language
          ? languageCodeMapping[userCourseSettings.language]
          : null,
        eligible_for_ects:
          tier === 1
            ? false
            : handlerCourse.automatic_completions_eligible_for_ects,
        completion_date: new Date(),
        tier: !isNullOrUndefined(tier) ? tier : undefined,
      },
    })
    // TODO: this only sends the completion email for the first tier completed
    pushMessageToClient(
      user.upstream_id,
      course_id,
      MessageType.COURSE_CONFIRMED,
    )
    const template = await prisma.course
      .findUnique({ where: { id: course_id } })
      .completion_email()
    if (template) {
      await sendEmailTemplateToUser(user, template)
    }
  } else if (!isNullOrUndefined(tier)) {
    const eligible_for_ects =
      tier === 1 ? false : handlerCourse.automatic_completions_eligible_for_ects
    try {
      const updated = await prisma.$queryRaw`
        UPDATE
          completion 
        SET tier=${tier}, eligible_for_ects=${eligible_for_ects}, updated_at=now()
        WHERE id=${completions[0]!.id} AND COALESCE(tier, 0) < ${tier}
        RETURNING tier;`
      if (updated.length > 0) {
        logger?.info("Existing completion found, updated tier")
      }
    } catch (error: any) {
      logger?.error(
        new DatabaseInputError("Error updating tier", completions[0], error),
      )
    }
    /*await prisma.completion.update({
      where: {
        id: completions[0]!.id,
      },
      data: {
        tier,
        eligible_for_ects:
          tier === 1
            ? false
            : handlerCourse.automatic_completions_eligible_for_ects,
      },
    })*/
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

const languageCodeMapping: Record<string, string> = {
  fi: "fi_FI",
  en: "en_US",
  se: "sv_SE",
  ee: "et_EE",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  hu: "hu_HU",
  lv: "lv_LV",
  da: "da_DK",
  nl: "nl_NL",
  hr: "hr_HR",
  lt: "lt_LT",
  ga: "ga_IE",
  bg: "bg_BG",
  cs: "cs_CZ",
  el: "el_GR",
  mt: "mt_MT",
  pt: "pt_PT",
  ro: "ro_RO",
  sk: "sk_SK",
  sl: "sl_SI",
  no: "nb_NO",
  "fr-be": "fr_BE",
  "nl-be": "nl_BE",
  "en-ie": "en_IE",
  pl: "pl_PL",
  "de-at": "de_AT",
  es: "es_ES",
  "el-cy": "el_CY",
  "en-lu": "en_LU",
}
