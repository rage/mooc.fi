import {
  objectType,
  extendType,
  idArg,
  stringArg,
  intArg,
  arg,
  floatArg,
  nonNull,
  list,
} from "nexus"
import { UserInputError } from "apollo-server-core"

import { isAdmin } from "../accessControl"

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
        return (res?.progress as any) || []
      },
    })

    // t.prismaFields(["*"])

    t.nullable.field("user_course_settings", {
      type: "UserCourseSetting",
      resolve: async (parent, _, ctx) => {
        return (
          await ctx.prisma.userCourseProgress
            .findUnique({
              where: { id: parent.id },
            })
            .user()
            .user_course_settings({
              where: { course_id: parent.course_id },
            })
        )?.[0]

        /*const { course_id, user_id } =
          (await ctx.prisma.userCourseProgress.findUnique({
            where: { id: parent.id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) || {}

        if (!course_id || !user_id) {
          throw new Error("course or user not found")
        }

        return await ctx.prisma.userCourseSetting.findFirst({
          where: {
            course_id,
            user_id,
          },
        })*/
      },
    })

    t.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: async (parent, _, ctx) => {
        const { course_id, user_id, progress } = parent

        if (!course_id || !user_id) {
          throw new Error("no course or user found")
        }

        const courseProgress: any = progress || []
        const exercises = await ctx.prisma.course
          .findUnique({
            where: {
              id: course_id,
            },
          })
          .exercises({
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
          (acc, curr) => acc + (curr.exercise_completions?.length ?? 0),
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

    /*t.crud.userCourseProgresses({
      filtering: {
        user: true,
        course_courseTouser_course_progress: true,
      },
      pagination: true,
    })*/

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
          throw new Error("must provide course_id or course_slug")
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
        /*return ctx.prisma.userCourseProgress.findMany({
          skip: skip ?? undefined,
          take: take ?? undefined,
          cursor: cursor ? { id: cursor.id ?? undefined } : undefined,
          where: {
            user_id,
            course: {
              OR: [
                {
                  id: course_id ?? undefined,
                },
                {
                  slug: course_slug ?? undefined,
                },
              ],
            },
          },
        })*/
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
        const {
          user_id,
          course_id,
          progress,
          max_points,
          n_points,
          extra,
        } = args

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
