import { booleanArg, objectType } from "nexus"

import { notEmpty } from "../util/notEmpty"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.nonNull.id("course_id")
    t.nonNull.id("user_id")
    t.id("inherit_settings_from_id")
    t.id("completions_handled_by_id")
    t.boolean("include_no_points_awarded_exercises")
    t.boolean("include_deleted_exercises")

    t.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        return ctx.prisma.course.findUnique({
          where: { id: course_id },
        })
      },
    })

    t.nonNull.list.nonNull.field("exercises", {
      type: "Exercise",
      args: {
        includeDeleted: booleanArg({
          description:
            "Include deleted exercises. Will override parent setting.",
        }),
        includeNoPointsAwarded: booleanArg({
          description:
            "Include exercises with max_points = 0. Will override parent setting.",
        }),
      },
      resolve: async (
        {
          course_id,
          include_deleted_exercises,
          include_no_points_awarded_exercises,
        },
        { includeDeleted, includeNoPointsAwarded },
        ctx,
      ) => {
        const deleted = notEmpty(includeDeleted)
          ? includeDeleted
          : include_deleted_exercises
        const noPoints = notEmpty(includeNoPointsAwarded)
          ? includeNoPointsAwarded
          : include_no_points_awarded_exercises

        return ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .exercises({
            where: {
              ...(!noPoints && {
                max_points: { gt: 0 },
              }),
              ...(!deleted && {
                // same here: { deleted: { not: true } } will skip null
                OR: [{ deleted: false }, { deleted: null }],
              }),
            },
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
        includeDeleted: booleanArg({
          description:
            "Include deleted exercises. Will override parent setting.",
        }),
        includeNoPointsAwarded: booleanArg({
          description:
            "Include exercises with max_points = 0. Will override parent setting.",
        }),
      },
      resolve: async (
        {
          user_id,
          course_id,
          include_deleted_exercises,
          include_no_points_awarded_exercises,
        },
        { includeNoPointsAwarded, includeDeleted },
        ctx,
      ) => {
        const deleted = notEmpty(includeDeleted)
          ? includeDeleted
          : include_deleted_exercises
        const noPoints = notEmpty(includeNoPointsAwarded)
          ? includeNoPointsAwarded
          : include_no_points_awarded_exercises

        const data = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .exercises({
            where: {
              ...(!noPoints && {
                max_points: { gt: 0 },
              }),
              ...(!deleted && {
                // same here: { deleted: { not: true } } will skip null
                OR: [{ deleted: false }, { deleted: null }],
              }),
            },
            select: {
              exercise_completions: {
                where: {
                  user_id,
                },
                orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
                take: 1,
              },
            },
          })

        return data?.flatMap((d) => d.exercise_completions).filter(notEmpty)
        // TODO/FIXME: testing if this actually reomves any extra joins
        /*return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: {
                course_id,
                ...(!noPoints && {
                  max_points: { gt: 0 },
                }),
                ...(!deleted && {
                  // same here: { deleted: { not: true } } will skip null
                  OR: [{ deleted: false }, { deleted: null }],
                }),
              },
            },
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
            distinct: "exercise_id",
          })*/
      },
    })

    t.field("start_date", {
      type: "DateTime",
      resolve: async (
        { user_id, course_id, inherit_settings_from_id },
        _,
        ctx,
      ) => {
        const userCourseSetting = await ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .user_course_settings({
            where: { course_id: inherit_settings_from_id ?? course_id },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return userCourseSetting?.[0]?.created_at
      },
    })
  },
})
