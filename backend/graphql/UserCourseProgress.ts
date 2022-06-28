import { isAdmin } from "../accessControl"
import { Prisma } from "@prisma/client"
import { UserInputError } from "apollo-server-express"
import {
  arg,
  extendType,
  floatArg,
  idArg,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

// progress seems not to be uniform, let's try to normalize it a bit
const normalizeProgress = <T extends object | Prisma.JsonValue>(
  data?: T | T[],
): T[] =>
  (data ? (Array.isArray(data) ? data : [data]) : []).filter((p) =>
    p?.hasOwnProperty("progress"),
  )

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
    t.model.extra()

    t.list.field("progress", {
      type: "Json",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.userCourseProgress.findUnique({
          where: { id: parent.id },
          select: { progress: true },
        })

        // TODO/FIXME: do we want to return progresses that might not have "progress" field?
        return normalizeProgress(res?.progress)
      },
    })

    // t.prismaFields(["*"])

    t.nullable.field("user_course_settings", {
      type: "UserCourseSetting",
      resolve: async (parent, _, ctx) => {
        if (!parent.course_id) {
          throw new Error("progress not connected to course")
        }

        const course = await ctx.prisma.course.findUnique({
          where: { id: parent.course_id },
        })

        if (!course) {
          throw new Error("course not found")
        }

        const settings = await ctx.prisma.userCourseProgress
          .findUnique({
            where: { id: parent.id },
          })
          .user()
          .user_course_settings({
            where: { course_id: course.inherit_settings_from_id ?? course.id },
            orderBy: {
              created_at: "asc",
            },
          })

        return settings?.[0]
      },
    })

    t.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: async ({ course_id, user_id, progress }, _, ctx) => {
        if (!course_id || !user_id) {
          throw new Error("no course or user found")
        }

        const courseProgress: any = normalizeProgress(progress)

        const exercises = await ctx.prisma.course
          .findUnique({
            where: {
              id: course_id,
            },
          })
          .exercises({
            where: {
              NOT: {
                deleted: true,
              },
            },
            select: {
              id: true,
              exercise_completions: {
                where: {
                  user_id,
                },
              },
            },
          })

        const completedExerciseCount = exercises.reduce(
          (acc, curr) => acc + (curr.exercise_completions?.length || 0),
          0,
        )
        const totalProgress =
          (courseProgress?.reduce(
            (acc: number, curr: any) => acc + curr.progress,
            0,
          ) ?? 0) / (courseProgress?.length || 1)
        const exerciseProgress =
          completedExerciseCount / (exercises.length || 1)

        return {
          total: totalProgress,
          exercises: exerciseProgress,
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
        const result = await ctx.prisma.userCourseProgress.findFirst({
          where: {
            user_id,
            course_id,
          },
          orderBy: { created_at: "asc" },
        })

        if (!result) throw new UserInputError("Not found")

        return result
      },
    })

    // FIXME: (?) broken until the nexus json thing is fixed or smth
    t.list.field("userCourseProgresses", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg(),
        course_slug: stringArg(),
        course_id: idArg(),
        skip: intArg(),
        take: intArg(),
        cursor: arg({ type: "UserCourseProgressWhereUniqueInput" }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { skip, take, cursor, user_id, course_id, course_slug } = args

        if (!course_id && !course_slug) {
          throw new UserInputError(
            "must provide either course_id or course_slug",
          )
        }

        return ctx.prisma.course
          .findUnique({
            where: {
              id: course_id ?? undefined,
              slug: course_slug ?? undefined,
            },
          })
          .user_course_progresses({
            skip: skip ?? undefined,
            take: take ?? undefined,
            cursor: cursor ? { id: cursor.id ?? undefined } : undefined,
            where: {
              user_id,
            },
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
              type: "PointsByGroup",
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
            progress,
            extra,
            max_points,
            n_points,
          },
        })
      },
    })
  },
})
