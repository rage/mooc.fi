import { booleanArg, objectType } from "nexus"

// import { ProgressExtra } from "../bin/kafkaConsumer/common/userCourseProgress/interfaces"
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
    t.int("tier")

    t.list.nonNull.field("tier_summaries", {
      type: "UserCourseSummary",
    })

    t.nonNull.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        return ctx.prisma.course.findUnique({
          where: { id: course_id },
          rejectOnNotFound: true,
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

        return ctx.prisma.user
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
          })
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
