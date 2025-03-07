import { booleanArg, inputObjectType, objectType } from "nexus"

import { isDefined } from "../util"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.nonNull.id("course_id")
    t.nonNull.id("user_id")
    t.id("inherit_settings_from_id")
    t.id("completions_handled_by_id")
    t.boolean("include_no_points_awarded_exercises")
    t.boolean("include_deleted_exercises")
    t.int("tier")

    t.list.nonNull.field("tier_summaries", {
      type: "UserCourseSummary",
    })

    t.nonNull.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        return ctx.prisma.course.findUniqueOrThrow({
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
        const deleted = isDefined(includeDeleted)
          ? includeDeleted
          : include_deleted_exercises
        const noPoints = isDefined(includeNoPointsAwarded)
          ? includeNoPointsAwarded
          : include_no_points_awarded_exercises ?? true // Default to true if not provided

        return (
          (await ctx.prisma.course
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
            })) ?? []
        )
      },
    })

    t.field("completion", {
      type: "Completion",
      args: {
        includeOnlyCompleted: booleanArg(),
      },
      resolve: async (
        { user_id, course_id, completions_handled_by_id },
        { includeOnlyCompleted },
        ctx,
      ) => {
        const completions = await ctx.prisma.course
          .findUnique({
            where: { id: completions_handled_by_id ?? course_id },
          })
          .completions({
            where: {
              user_id,
              ...(includeOnlyCompleted && { completed: true }),
            },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return completions?.[0] ?? null
      },
    })

    t.nullable.field("user_course_progress", {
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

        return progresses?.[0] ?? null
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
        includeDeletedExercises: booleanArg({
          description:
            "Include deleted exercises. Will override parent setting.",
        }),
        includeNoPointsAwardedExercises: booleanArg({
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
        { includeNoPointsAwardedExercises, includeDeletedExercises },
        ctx,
      ) => {
        const deleted = isDefined(includeDeletedExercises)
          ? includeDeletedExercises
          : include_deleted_exercises
        const noPoints = isDefined(includeNoPointsAwardedExercises)
          ? includeNoPointsAwardedExercises
          : include_no_points_awarded_exercises ?? true // Default to true if not provided
        const data =
          (await ctx.prisma.course
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
            })) ?? []

        return data?.flatMap((d) => d.exercise_completions).filter(isDefined)
        // TODO/FIXME: testing if this actually removes any extra joins
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

    t.datetime("start_date", {
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

        return userCourseSetting?.[0]?.created_at ?? null
      },
    })

    // TODO: not sure if needed, can be queried through each user_course_progress
    /*t.field("extra", {
      type: "ProgressExtra",
      resolve: async ({ user_id, completions_handled_by_id }, _, ctx) => {
        if (!completions_handled_by_id) {
          return null
        }

        const progress = await ctx.prisma.userCourseProgress.findFirst({
          where: {
            user_id,
            course_id: completions_handled_by_id,
          },
          orderBy: {
            created_at: "asc",
          },
        })

        if (!progress?.extra) {
          return null
        }

        const extra = progress.extra as unknown as ProgressExtra
        const tiers = Object.keys(extra.tiers).map((key) => ({
          tier: Number(key),
          ...extra.tiers[key],
        }))
        const exercises = Object.keys(extra.exercises).map((key) => ({
          exercise_number: Number(key),
          ...extra.exercises[key],
        }))

        return {
          ...extra,
          tiers,
          exercises,
        }
      },
    })*/
  },
})

export const UserCourseSummaryOrderByInput = inputObjectType({
  name: "UserCourseSummaryOrderByInput",
  definition(t) {
    t.field("activity_date", { type: "SortOrder" })
    t.field("completion_date", { type: "SortOrder" })
    t.field("name", { type: "SortOrder" })
  },
})
