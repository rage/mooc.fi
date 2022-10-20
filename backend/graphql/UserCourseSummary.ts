import { booleanArg, objectType } from "nexus"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.nonNull.field("course", { type: "Course" })
    t.nonNull.field("user", { type: "User" })
    t.nonNull.id("course_id", { resolve: (parent) => parent.course.id })
    t.nonNull.id("user_id", { resolve: (parent) => parent.user.id })

    t.nullable.field("completion", {
      type: "Completion",
      resolve: async (
        {
          user: { id: user_id },
          course: { id: course_id, completions_handled_by_id },
        },
        _,
        ctx,
      ) => {
        const completions = await ctx.prisma.course
          .findUnique({
            where: { id: completions_handled_by_id ?? course_id },
          })
          .completions({
            where: {
              user_id,
            },
            // TODO: completed: true?
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return completions?.[0]
      },
    })

    t.nullable.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async (
        { user: { id: user_id }, course: { id: course_id } },
        _,
        ctx,
      ) => {
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

        return progresses?.[0]
      },
    })

    t.nonNull.list.nonNull.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (
        { user: { id: user_id }, course: { id: course_id } },
        _,
        ctx,
      ) => {
        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_service_progresses({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
            distinct: ["course_id", "service_id"],
          })

        return progresses ?? []
      },
    })

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        includeDeletedExercises: booleanArg(),
      },
      resolve: async (
        { user: { id: user_id }, course: { id: course_id } },
        { includeDeletedExercises = false },
        ctx,
      ) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: {
                course_id,
                ...(!includeDeletedExercises && {
                  // same here: { deleted: { not: true } } will skip null
                  OR: [{ deleted: false }, { deleted: null }],
                }),
              },
            },
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
            distinct: "exercise_id",
          })
      },
    })
  },
})
