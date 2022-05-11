import { redisify } from "../../../../../services/redis"
import Template from "../types/Template"

export class StartedCourseCount extends Template {
  async resolve() {
    const course = await this.context.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const startedCourse = await redisify<string>(
      async () => {
        const count = (
          await this.context.prisma.$queryRaw<Array<{ count: number }>>`
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
    const course = await this.context.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const completedCourse = await redisify<string>(
      async () => {
        const count = (
          await this.context.prisma.$queryRaw<Array<{ count: number }>>`
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
    const course = await this.context.prisma.course.findFirst({
      where: { course_stats_email: { id: this.emailTemplate.id } },
    })

    if (!course) {
      return ""
    }

    const atLeastOneExercise = await redisify<string>(
      async () => {
        const count = (
          await this.context.prisma.$queryRaw<Array<{ count: number }>>`
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
