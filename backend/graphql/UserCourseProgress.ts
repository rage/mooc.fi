import { groupBy } from "lodash"
import {
  arg,
  extendType,
  floatArg,
  idArg,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { Prisma } from "@prisma/client"

import { isAdmin } from "../accessControl"
import { ProgressExtra } from "../bin/kafkaConsumer/common/userCourseProgress/interfaces"
import {
  BAIExerciseCount,
  pointsNeeded as BAIPointsNeeded,
  requiredByTier as BAIRequiredByTier,
  BAITierNameToNumber,
  BAItiers,
  exerciseCompletionsNeeded,
} from "../config/courseConfig"
import { GraphQLUserInputError } from "../lib/errors"
import { getCourseOrAlias } from "../util/db-functions"
import { notEmpty } from "../util/notEmpty"

// progress seems not to be uniform, let's try to normalize it a bit
const normalizeProgress = <T extends object | Prisma.JsonValue>(
  data?: T | T[],
): T[] => {
  if (!data) {
    return []
  }

  return (Array.isArray(data) ? data : [data]).filter((p) =>
    p?.hasOwnProperty("progress"),
  )
}

export const UserCourseProgress = objectType({
  name: "UserCourseProgress",
  definition(t) {
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.created_at()
    t.model.max_points()
    t.model.n_points()
    // TODO/FIXME: this was borked on some previous version because of JSON, might work now
    // t.model.progress()
    t.model.updated_at()
    t.model.user_id()
    t.model.user()
    t.model.user_course_service_progresses()

    // compatibility for older queries
    t.nonNull.list.nonNull.field("progress", {
      type: "Json",
      deprecation: "use points_by_group",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.userCourseProgress.findUnique({
          where: { id: parent.id },
          select: { progress: true },
        })

        // TODO/FIXME: do we want to return progresses that might not have "progress" field?
        return normalizeProgress(res?.progress)
      },
    })

    t.nonNull.list.nonNull.field("points_by_group", {
      type: "PointsByGroup",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.userCourseProgress.findUnique({
          where: { id: parent.id },
          select: { progress: true },
        })

        // TODO/FIXME: do we want to return progresses that might not have "progress" field?
        return normalizeProgress(res?.progress as any)
      },
    })

    // t.prismaFields(["*"])

    t.field("user_course_settings", {
      type: "UserCourseSetting",
      resolve: async (parent, _, ctx) => {
        if (!parent.course_id || !parent.user_id) {
          throw new Error("progress not connected to course or user")
        }

        const course = await ctx.prisma.course.findUnique({
          where: { id: parent.course_id },
        })

        if (!course) {
          throw new Error("course not found")
        }

        const settings = await ctx.prisma.user
          .findUnique({
            where: { id: parent.user_id },
          })
          .user_course_settings({
            where: { course_id: course.inherit_settings_from_id ?? course.id },
            orderBy: {
              created_at: "asc",
            },
          })

        return settings?.[0] ?? null
      },
    })

    t.nonNull.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: async ({ course_id, user_id, n_points, max_points }, _, ctx) => {
        if (!course_id || !user_id) {
          throw new Error("no course or user found")
        }

        const exercises = await ctx.prisma.$queryRaw<
          Array<{
            exercise_id: string
            exercise_completion_id: string | null
            completed: boolean | null
            attempted: boolean | null
          }>
        >`
          select e.id as exercise_id,
                 ecs.id as exercise_completion_id,
                 completed,
                 attempted
            from exercise e
            full outer join (
              select
                ec.id, ec.exercise_id, completed, attempted,
                row_number() over (
                  partition by ec.exercise_id
                  order by ec.timestamp desc, ec.updated_at desc
                ) as row
              from exercise_completion ec
              join exercise e on ec.exercise_id = e.id
              where ec.user_id = ${user_id}::uuid
              and e.course_id = ${course_id}::uuid
            ) ecs on ecs.exercise_id = e.id and row = 1
          where e.course_id = ${course_id}::uuid
          and e.deleted <> true
          and e.max_points > 0
        `

        const completedExerciseCount = exercises.filter(
          (e) => e.exercise_completion_id && e.completed,
        ).length
        const attemptedExerciseCount = exercises.filter(
          (e) => e.exercise_completion_id && e.attempted,
        ).length

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const totalProgress = (n_points || 0) / (max_points || 1)
        const exerciseProgress =
          completedExerciseCount / (exercises.length || 1)

        return {
          total: totalProgress,
          exercises: exerciseProgress,
          exercise_count: exercises.length,
          exercises_completed_count: completedExerciseCount,
          exercises_attempted_count: attemptedExerciseCount,
        }
      },
    })

    t.field("extra", {
      type: "ProgressExtra",
      resolve: async ({ id, user_id }, _, ctx) => {
        const progress = await ctx.prisma.userCourseProgress.findUnique({
          where: {
            id,
          },
        })

        if (!progress?.extra || !user_id) {
          return null
        }

        const extra = progress.extra as unknown as ProgressExtra
        const tiers = Object.entries(extra.tiers ?? {}).map(
          ([tierKey, tierValue]) => {
            const tier = BAITierNameToNumber[tierKey] ?? 0
            const requiredByTier = BAIRequiredByTier[tier] ?? 0
            const { exerciseCompletions } = tierValue ?? {}
            const exercisesNeededPercentage =
              requiredByTier > 0
                ? Math.min((exerciseCompletions ?? 0) / requiredByTier, 1)
                : 1
            const exercisePercentage = exerciseCompletions / BAIExerciseCount

            return {
              id: BAItiers[tier],
              name: tierKey,
              tier,
              requiredByTier,
              exerciseCount: BAIExerciseCount,
              exercisePercentage,
              exercisesNeededPercentage,
              ...tierValue,
            }
          },
        )
        const exercisesFromTiers = await ctx.prisma.exercise.findMany({
          where: {
            custom_id: {
              in: Object.values(extra.exercises)
                .map((e) => e.custom_id)
                .filter(notEmpty),
            },
          },
        })
        const exerciseMap = groupBy(exercisesFromTiers, "custom_id")

        const exercises = Object.keys(extra.exercises).map((key) => ({
          exercise_number: Number(key),
          user_id,
          exercise_id:
            exerciseMap[extra.exercises[key].custom_id ?? ""]?.[0]?.id,
          exercise: exerciseMap[extra.exercises[key].custom_id ?? ""]?.[0],
          ...extra.exercises[key],
        }))
        const n_points = exercises.reduce((acc, curr) => acc + curr.n_points, 0)
        const max_points = BAIExerciseCount
        const exercisePercentage = exercises.length / BAIExerciseCount
        const pointsPercentage = n_points / max_points
        const pointsNeededPercentage = Math.min(n_points / BAIPointsNeeded, 1)
        const exercisesNeededPercentage = Math.min(
          exercises.length / exerciseCompletionsNeeded,
          1,
        )

        return {
          ...extra,
          n_points,
          max_points,
          pointsNeeded: BAIPointsNeeded,
          exercisePercentage,
          pointsPercentage,
          pointsNeededPercentage,
          exercisesNeededPercentage,
          totalExerciseCount: BAIExerciseCount,
          totalExerciseCompletionsNeeded: exerciseCompletionsNeeded,
          tiers,
          exercises,
        }
      },
    })
  },
})

export const UserCourseProgressQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: nonNull(idArg()),
        course_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id, course_id } = args
        const result = (
          await ctx.prisma.course
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
        )?.[0]

        if (!result) throw new GraphQLUserInputError("Not found")

        return result
      },
    })

    // FIXME: (?) broken until the nexus json thing is fixed or smth
    t.list.nonNull.field("userCourseProgresses", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg(),
        course_slug: stringArg(),
        course_id: idArg(),
        skip: intArg(),
        take: intArg(),
        cursor: arg({ type: "UserCourseProgressCursorInput" }), // was: "UserCourseProgressWhereUniqueInput" but that broke for some reason
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_slug, skip, take, cursor, user_id } = args
        let { course_id } = args

        if (!course_id && !course_slug) {
          throw new GraphQLUserInputError(
            "must provide either course_id or course_slug",
          )
        }

        if (course_slug) {
          const course = await getCourseOrAlias(ctx)({
            where: {
              slug: course_slug,
            },
          })

          if (course) {
            course_id = course.id
          }
        }

        return ctx.prisma.course
          .findUnique({
            where: {
              id: course_id ?? undefined,
            },
          })
          .user_course_progresses({
            skip: skip ?? undefined,
            take: take ?? undefined,
            cursor: cursor ? { id: cursor.id ?? undefined } : undefined,
            where: {
              user_id,
            },
            distinct: ["user_id", "course_id"],
            orderBy: { created_at: "asc" },
          })
      },
    })
  },
})

export const UserCourseProgressMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: nonNull(idArg()),
        course_id: nonNull(idArg()),
        progress: list(
          nonNull(
            arg({
              type: "PointsByGroupInput",
            }),
          ),
        ),
        extra: arg({
          type: "Json",
        }),
        max_points: floatArg(),
        n_points: floatArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { user_id, course_id, progress, max_points, n_points, extra } =
          args

        return ctx.prisma.userCourseProgress.create({
          data: {
            user: { connect: { id: user_id } },
            course: { connect: { id: course_id } },
            progress: progress ?? Prisma.JsonNull,
            extra,
            max_points,
            n_points,
          },
        })
      },
    })
  },
})

export const UserCourseProgressCursorInput = inputObjectType({
  name: "UserCourseProgressCursorInput",
  definition(t) {
    t.nonNull.id("id")
  },
})
