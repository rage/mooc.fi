import { booleanArg, objectType } from "nexus"

import { GraphQLUserInputError } from "../lib/errors"

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
          throw new GraphQLUserInputError("need to specify course_id")
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
          throw new GraphQLUserInputError(
            "need to specify user_id and course_id",
          )
        }
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

    t.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new GraphQLUserInputError(
            "need to specify user_id and course_id",
          )
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

        return progresses?.[0]
      },
    })

    t.nonNull.list.nonNull.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new GraphQLUserInputError(
            "need to specify user_id and course_id",
          )
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
            distinct: ["course_id", "service_id"],
          })

        return progresses ?? []
      },
    })

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        includeDeleted: booleanArg(),
      },
      resolve: async (
        { user_id, course_id },
        { includeDeleted = false },
        ctx,
      ) => {
        if (!user_id || !course_id) {
          throw new GraphQLUserInputError(
            "need to specify user_id and course_id",
          )
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: {
                course_id,
                ...(!includeDeleted && {
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
