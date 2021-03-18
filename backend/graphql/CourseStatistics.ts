import { objectType } from "nexus"

export const DatedInt = objectType({
  name: "DatedInt",
  definition(t) {
    t.int("value")
    t.field("date", { type: "DateTime" })
  }
})
export const CourseStatistics = objectType({
  name: "CourseStatistics",
  definition(t) {
    t.id("course_id")

    t.nullable.field("started", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        const started = await ctx.prisma.$queryRaw(`
          SELECT COUNT(DISTINCT user_id)
          FROM user_course_setting
          WHERE course_id = '${course_id}';
        `)

        return {
          value: started?.[0].count,
          date: Date.now()
        }
      }
    })
    t.nullable.field("completed", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        const completed = await ctx.prisma.$queryRaw(`
          SELECT COUNT(DISTINCT user_id)
          FROM completion
          WHERE course_id = '${course_id}';
        `)

        return {
          value: completed?.[0].count,
          date: Date.now()
        }
      }
    })
    t.nullable.field("atLeastOneExercise", {
      type: "DatedInt",
      resolve: async ({ course_id }, __, ctx) => {
        const atLeastOne = await ctx.prisma.$queryRaw(`
          SELECT COUNT(DISTINCT user_id)
          FROM exercise_completion ec
          JOIN exercise e ON ec.exercise_id = e.id
          WHERE course_id = '${course_id}';
        `)

        return {
          value: atLeastOne?.[0].count,
          date: Date.now()
        }
      }
    })
  }
})