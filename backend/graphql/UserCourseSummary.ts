import { UserInputError } from "apollo-server-express"
import { objectType } from "nexus"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.id("course_id")
    t.id("user_id")
    t.id("inherit_settings_from_id")
    t.id("completions_handled_by_id")

    t.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        if (!course_id) {
          throw new UserInputError("need to specify course_id")
        }

        return ctx.prisma.course.findUnique({
          where: { id: course_id },
        })
      },
    })
    t.field("completion", {
      type: "Completion",
      resolve: async (
        { user_id, course_id, completions_handled_by_id },
        _,
        ctx,
      ) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const completions = await ctx.prisma.course
          .findUnique({
            where: { id: completions_handled_by_id ?? course_id },
          })
          .completions({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return completions?.[0] ?? null
      },
    })
    t.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_progresses({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return progresses?.[0] ?? null
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_service_progresses({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
          })

        return progresses ?? []
      },
    })

    t.list.field("exercise_completions", {
      type: "ExerciseCompletion",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: { course_id },
            },
            orderBy: { created_at: "asc" },
          })
      },
    })
  },
})
