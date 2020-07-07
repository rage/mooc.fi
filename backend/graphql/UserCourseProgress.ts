import { schema } from "nexus"
import { UserInputError } from "apollo-server-errors"
import { idArg, intArg, stringArg, arg, floatArg } from "@nexus/schema"
import { isAdmin } from "../accessControl"

schema.objectType({
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

    t.list.field("progress", {
      type: "Json",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.db.userCourseProgress.findOne({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // type error without any
      },
    })

    // t.prismaFields(["*"])

    t.field("user_course_settings", {
      type: "UserCourseSetting",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const { course_id, user_id } =
          (await ctx.db.userCourseProgress.findOne({
            where: { id: parent.id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) || {}
        /*const course= await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course_id || !user_id) {
          throw new Error("course or user not found")
        }

        const userCourseSettings = await ctx.db.userCourseSetting.findMany({
          where: {
            course_id,
            user_id,
          },
        })
        // FIXME: what if there's not any?
        return userCourseSettings?.[0] ?? null
      },
    })

    t.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: async (parent, _, ctx) => {
        const { course_id, user_id } =
          (await ctx.db.userCourseProgress.findOne({
            where: { id: parent.id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) || {}
        /*const course: Course = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course_id || !user_id) {
          throw new Error("no course or user found")
        }
        const courseProgresses = await ctx.db.userCourseProgress.findMany({
          where: { course_id, user_id },
        })
        // TODO/FIXME: proper typing
        const courseProgress: any = courseProgresses?.[0].progress ?? []
        const exercises = await ctx.db.course
          .findOne({ where: { id: course_id } })
          .exercises()
        const completedExercises = await ctx.db.exerciseCompletion.findMany({
          where: {
            exercise: { course_id },
            user_id,
          },
        })

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

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id, course_id } = args
        const result = await ctx.db.userCourseProgress.findMany({
          where: {
            user_id,
            course_id,
          },
        })

        if (!result.length) throw new UserInputError("Not found")

        return result[0]
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

        return ctx.db.userCourseProgress.findMany({
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

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
        progress: arg({
          type: "PointsByGroup",
          list: true,
          required: true,
        }),
        max_points: floatArg(),
        n_points: floatArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { user_id, course_id, progress, max_points, n_points } = args

        return ctx.db.userCourseProgress.create({
          data: {
            user: { connect: { id: user_id } },
            course: { connect: { id: course_id } },
            progress,
            max_points,
            n_points,
          },
        })
      },
    })
  },
})
