import { Prisma } from "@prisma/client"

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
        const conditions = [
          Prisma.sql`course_id = ${
            course.inherit_settings_from_id ?? course.id
          }::uuid`,
        ]
        if (courseInstanceLanguage) {
          conditions.push(Prisma.sql`language = ${courseInstanceLanguage}`)
        }
        const where = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        const count = (
          await this.prisma.$queryRaw<Array<{ count: number }>>`
            SELECT
              COUNT(DISTINCT user_id)
            FROM user_course_setting
            ${where};
          `
        )?.[0]?.count

        return `${count ?? 0}`
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
        const conditions = [
          Prisma.sql`course_id = ${
            course.completions_handled_by_id ?? course.id
          }::uuid`,
        ]
        if (completionLanguage) {
          conditions.push(
            Prisma.sql`completion_language = ${completionLanguage}`,
          )
        }
        const where = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        const count = (
          await this.prisma.$queryRaw<Array<{ count: number }>>`
          SELECT
            COUNT(DISTINCT user_id)
          FROM completion
          ${where};
        `
        )?.[0]?.count

        return `${count ?? 0}`
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
        const count = (
          await this.prisma.$queryRaw<Array<{ count: number }>>`
            SELECT
              COUNT(DISTINCT user_id)
            FROM exercise_completion ec
            JOIN exercise e ON ec.exercise_id = e.id
            WHERE course_id = ${course.id}::uuid
            AND attempted = true;
          `
        )?.[0]?.count

        return `${count ?? 0}`
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
        const conditions = [
          Prisma.sql`course_id = ${
            course.completions_handled_by_id ?? course.id
          }::uuid`,
          Prisma.sql`user_id IS NOT NULL`,
        ]
        if (completionLanguage) {
          conditions.push(
            Prisma.sql`completion_language = ${completionLanguage}`,
          )
        }
        const whereConditions = Prisma.sql`WHERE ${Prisma.join(
          conditions,
          " AND ",
        )}`
        const result = await this.prisma.$queryRaw<Array<{ email: string }>>`
            SELECT DISTINCT u.email
              FROM exercise_completion ec
              JOIN exercise e ON ec.exercise_id = e.id
              JOIN "user" u ON ec.user_id = u.id
              WHERE 
                e.course_id = ${course.id}::uuid
              AND
                ec.attempted = true
              AND
                u.id NOT IN (
                  SELECT DISTINCT(user_id)
                    FROM completion c
                    ${whereConditions}
                );
            `
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
