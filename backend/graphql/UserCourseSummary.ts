import { booleanArg, objectType } from "nexus"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    // t.nonNull.id("course_id")
    // t.nonNull.id("user_id")
    // t.id("inherit_settings_from_id")
    // t.id("completions_handled_by_id")
    t.nonNull.field("course", { type: "Course" })
    t.nonNull.field("user", { type: "User" })
    t.nonNull.id("course_id", { resolve: (parent) => parent.course.id })
    t.nonNull.id("user_id", { resolve: (parent) => parent.user.id })
    /*t.nullable.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        return ctx.prisma.course.findUnique({
          where: { id: course_id },
        })
      },
    })*/

    t.nullable.field("completion", {
      type: "Completion",
      resolve: async (
        { course, user },
        //{ user_id, course_id, completions_handled_by_id },
        _,
        ctx,
      ) => {
        const { id: course_id, completions_handled_by_id } = course
        const { id: user_id } = user
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
        {
          user,
          course,
          /*user_id, course_id*/
        },
        _,
        ctx,
      ) => {
        const { id: course_id } = course
        const { id: user_id } = user

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

    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (
        {
          user,
          course,
          /*user_id, course_id*/
        },
        _,
        ctx,
      ) => {
        const { id: course_id } = course
        const { id: user_id } = user

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

    t.list.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        includeDeleted: booleanArg(),
      },
      resolve: async (
        { user, course },
        //{ user_id, course_id },
        { includeDeleted = false },
        ctx,
      ) => {
        const { id: course_id } = course
        const { id: user_id } = user

        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: {
                course_id,
                ...(!includeDeleted && { deleted: { not: true } }),
              },
            },
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
            distinct: "exercise_id",
          })
      },
    })
  },
})
