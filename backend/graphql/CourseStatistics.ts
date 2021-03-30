import { objectType } from "nexus"
import { redisify } from "../services/redis"

export const DatedInt = objectType({
  name: "DatedInt",
  definition(t) {
    t.int("value")
    t.field("date", { type: "DateTime" })
  },
})

interface DatedInt {
  value?: number
  date: number
}

export const CourseStatistics = objectType({
  name: "CourseStatistics",
  definition(t) {
    t.id("course_id")

    t.nullable.field("started", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify<DatedInt>(
          async () => {
            const started = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id)
              FROM user_course_setting
              WHERE course_id = :course_id;
            `,
              { course_id },
            )

            return {
              value: started?.[0].count,
              date: Date.now(),
            }
          },
          {
            prefix: "coursestatistics_started",
            expireTime: 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })

    t.nullable.field("completed", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify<DatedInt>(
          async () => {
            const completed = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id)
              FROM completion
              WHERE course_id = :course_id;
            `,
              { course_id },
            )

            return {
              value: completed?.[0].count,
              date: Date.now(),
            }
          },
          {
            prefix: "coursestatistics_completed",
            expireTime: 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })
    t.nullable.field("atLeastOneExercise", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify<DatedInt>(
          async () => {
            const atLeastOne = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id)
              FROM exercise_completion ec
              JOIN exercise e ON ec.exercise_id = e.id
              WHERE course_id = :course_id;
            `,
              { course_id },
            )

            return {
              value: atLeastOne?.[0].count,
              date: Date.now(),
            }
          },
          {
            prefix: "coursestatistics_atLeastOneExercise",
            expireTime: 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })
  },
})
