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
        const { course_id, user_id } =
          (await ctx.prisma.userCourseProgress.findUnique({
            where: { id: parent.id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) || {}
        /*const course= await ctx.prisma
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.prisma
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course_id || !user_id) {
          throw new Error("course or user not found")
        }

        return await ctx.prisma.userCourseSetting.findFirst({
          where: {
            course_id,
            user_id,
          },
        })
      },
    })

    t.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: async (parent, _, ctx) => {
        const { course_id, user_id } =
          (await ctx.prisma.userCourseProgress.findUnique({
            where: { id: parent.id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) || {}
        /*const course: Course = await ctx.prisma
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.prisma
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course_id || !user_id) {
          throw new Error("no course or user found")
        }
        const courseProgresses = await ctx.prisma.userCourseProgress.findMany({
          where: { course_id, user_id },
          orderBy: { created_at: "asc" },
        })
        // TODO/FIXME: proper typing
        const courseProgress: any = courseProgresses?.[0].progress ?? []
        const exercises = await ctx.prisma.course
          .findUnique({ where: { id: course_id } })
          .exercises()
        const completedExercises = await ctx.prisma.exerciseCompletion.findMany(
          {
            where: {
              exercise: { course_id },
              user_id,
            },
          },
        )

        const totalProgress =
          (courseProgress?.reduce(
            (acc: number, curr: any) => acc + curr.progress,
            0,
          ) ?? 0) / (courseProgress.length || 1)
        const exerciseProgress =
          completedExercises.length / (exercises.length || 1)

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

        return ctx.prisma.userCourseProgress.findMany({
          skip: skip ?? undefined,
          take: take ?? undefined,
          cursor: cursor ? { id: cursor.id ?? undefined } : undefined,
          /*first: first ?? undefined,
          last: last ?? undefined,
          before: before ? { id: before } : undefined,
          after: after ? { id: after } : undefined,*/
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
