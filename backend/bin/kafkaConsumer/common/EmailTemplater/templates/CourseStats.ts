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

    const startedCourse = await redisify<string>(
      async () => {
        const count = (
          await this.prisma.$queryRaw<Array<{ count: number }>>`
            SELECT 
              COUNT(DISTINCT user_id) 
            FROM user_course_setting 
            WHERE course_id = ${course.id};
          `
        )?.[0]?.count

        return `${count}`
      },
      {
        prefix: "startedcoursecount",
        expireTime: 60 * 60, // hour,
        key: `${course.id}`,
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

    const completedCourse = await redisify<string>(
      async () => {
        const count = (
          await this.prisma.$queryRaw<Array<{ count: number }>>`
          SELECT 
            COUNT(DISTINCT user_id) 
          FROM completion 
          WHERE course_id = ${course.id};
        `
        )?.[0]?.count

        return `${count}`
      },
      {
        prefix: "completedcoursecount",
        expireTime: 60 * 60, // hour,
        key: `${course.id}`,
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
          WHERE course_id = ${course.id};
        `
        )?.[0]?.count

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

    const atLeastOneExerciseButNotCompletedEmails = await redisify<string>(
      async () => {
        const result = await this.prisma.$queryRaw<Array<{ email: string }>>`
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
                    WHERE c.course_id = ${course.id}
                    AND user_id IS NOT NULL
                );
          `

        return result?.map((entry) => entry.email).join("\n")
      },
      {
        prefix: "atleastoneexercisebutnotcompletedemails",
        expireTime: 60 * 60, // hour,
        key: `${course.id}`,
      },
    )

    return atLeastOneExerciseButNotCompletedEmails
  }
}
