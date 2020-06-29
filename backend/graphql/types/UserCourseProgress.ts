import { schema } from "nexus"

schema.objectType({
  name: "user_course_progress",
  definition(t) {
    t.model.id()
    t.model.course({ alias: "course_id" })
    t.model.created_at()
    t.model.max_points()
    t.model.n_points()
    //t.model.progress()
    t.model.updated_at()
    t.model.user({ alias: "user_id" })
    t.model.user_userTouser_course_progress({ alias: "user" })
    t.model.course_courseTouser_course_progress({ alias: "course" })
    t.model.user_course_service_progress()

    t.list.field("progress", {
      type: "Json",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.db.user_course_progress.findOne({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // type error without any
      },
    })

    // t.prismaFields(["*"])

    t.field("UserCourseSettings", {
      type: "UserCourseSettings",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const { course, user } =
          (await ctx.db.user_course_progress.findOne({
            where: { id: parent.id },
            select: {
              course: true,
              user: true,
            },
          })) || {}
        /*const course= await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course || !user) {
          throw new Error("course or user not found")
        }

        const userCourseSettings = await ctx.db.userCourseSettings.findMany({
          where: {
            course,
            user,
          },
        })
        // FIXME: what if there's not any?
        return userCourseSettings?.[0] ?? null
      },
    })

    t.field("exercise_progress", {
      type: "exercise_progress",
      resolve: async (parent, _, ctx) => {
        const { course, user } =
          (await ctx.db.user_course_progress.findOne({
            where: { id: parent.id },
            select: {
              course: true,
              user: true,
            },
          })) || {}
        /*const course: Course = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .course_courseTouser_course_progress()
        const user: User = await ctx.db
          .user_course_progress.findOne({ where: { id: parent.id } })
          .user_course_service_progress()*/

        if (!course || !user) {
          throw new Error("no course or user found")
        }
        const courseProgresses = await ctx.db.user_course_progress.findMany({
          where: { course: course, user: user },
        })
        // TODO/FIXME: proper typing
        const courseProgress: any = courseProgresses.length
          ? courseProgresses[0].progress
          : []
        const exercises = await ctx.db.course
          .findOne({ where: { id: course } })
          .exercise()
        const completedExercises = await ctx.db.exercise_completion.findMany({
          where: {
            exercise_exerciseToexercise_completion: { course },
            user,
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
