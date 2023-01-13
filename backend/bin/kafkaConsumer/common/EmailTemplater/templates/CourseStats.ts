import {
  completionLanguageMap,
  LanguageAbbreviation,
} from "../../../../../config/languageConfig"
import { redisify } from "../../../../../services/redis"
import Template from "../types/Template"

export class StartedCourseCount extends Template {
  async resolve() {
    const course = await this.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const courseInstanceLanguage = this.emailTemplate.course_instance_language

    const startedCourse = await redisify<string>(
      async () => {
        const count = this.prisma.userCourseSetting.count({
          where: {
            course_id: course.inherit_settings_from_id ?? course.id,
            ...(courseInstanceLanguage
              ? { language: courseInstanceLanguage }
              : {}),
          },
          distinct: ["user_id"],
        })

        return `${count}`
      },
      {
        prefix: "startedcoursecount",
        expireTime: 60 * 60, // hour,
        key:
          `${course.id}` +
          (courseInstanceLanguage ? `-${courseInstanceLanguage}` : ""),
      },
    )

    return startedCourse
  }
}

export class CompletedCourseCount extends Template {
  async resolve() {
    const course = await this.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const courseInstanceLanguage = this.emailTemplate.course_instance_language
    const completionLanguage = courseInstanceLanguage
      ? completionLanguageMap[courseInstanceLanguage as LanguageAbbreviation]
      : undefined

    const completedCourse = await redisify<string>(
      async () => {
        const count = await this.prisma.completion.count({
          where: {
            course_id: course.completions_handled_by_id ?? course.id,
            ...(completionLanguage
              ? { completion_language: completionLanguage }
              : {}),
          },
          distinct: ["user_id"],
        })

        return `${count}`
      },
      {
        prefix: "completedcoursecount",
        expireTime: 60 * 60, // hour,
        key:
          `${course.id}` +
          (courseInstanceLanguage ? `-${courseInstanceLanguage}` : ""),
      },
    )

    return completedCourse
  }
}

export class AtLeastOneExerciseCount extends Template {
  async resolve() {
    const course = await this.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const atLeastOneExercise = await redisify<string>(
      async () => {
        const count = await this.prisma.exerciseCompletion.count({
          where: {
            exercise: {
              course_id: course.id,
            },
          },
          distinct: ["user_id"],
        })

        return `${count}`
      },
      {
        prefix: "atleastoneexercisecount",
        expireTime: 60 * 60, // hour,
        key: `${course.id}`,
      },
    )

    return atLeastOneExercise
  }
}

export class AtLeastOneExerciseButNotCompletedEmails extends Template {
  async resolve() {
    const course = await this.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const courseOwnership = await this.prisma.courseOwnership.findFirst({
      where: {
        course_id: course.id,
        user_id: this.user.id,
      },
    })

    if (!courseOwnership) {
      throw new Error("no permission - user is not the owner of this course")
    }

    const courseInstanceLanguage = this.emailTemplate.course_instance_language
    const completionLanguage = courseInstanceLanguage
      ? completionLanguageMap[courseInstanceLanguage as LanguageAbbreviation]
      : undefined

    const atLeastOneExerciseButNotCompletedEmails = await redisify<string>(
      async () => {
        const result = await this.prisma.user.findMany({
          where: {
            exercise_completions: {
              some: {
                exercise: {
                  course_id: course.id,
                },
              },
            },
            completions: {
              none: {
                course_id: course.completions_handled_by_id ?? course.id,
                ...(completionLanguage
                  ? { completion_language: completionLanguage }
                  : {}),
              },
            },
          },
          distinct: ["id"],
          select: {
            email: true,
          },
        })
        /*const result = await this.prisma.$queryRaw<Array<{ email: string }>>`
            SELECT DISTINCT u.email
              FROM exercise_completion ec
              JOIN exercise e ON ec.exercise_id = e.id
              JOIN "user" u ON ec.user_id = u.id
              WHERE 
                e.course_id = ${course.id} 
              AND
                u.id NOT IN (
                  SELECT DISTINCT(user_id)
                    FROM completion c
                    WHERE c.course_id = ${
                      course.completions_handled_by_id ?? course.id
                    }
                    ${completionLanguage ? `AND c.completion_language = ${completionLanguage} ` : ""}
                    AND user_id IS NOT NULL
                );
          `*/

        return result?.map((entry) => entry.email).join("\n")
      },
      {
        prefix: "atleastoneexercisebutnotcompletedemails",
        expireTime: 60 * 60, // hour,
        key:
          `${course.id}` +
          (courseInstanceLanguage ? `-${courseInstanceLanguage}` : ""),
      },
    )

    return atLeastOneExerciseButNotCompletedEmails
  }
}
