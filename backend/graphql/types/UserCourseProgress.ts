import { schema } from "nexus"
// import { prismaObjectType } from "nexus-prisma"
import {
  UserCourseSettings,
  Prisma,
  Course,
  User,
} from "../generated/prisma-client"

schema.objectType({
  name: "user_course_progress",
  definition(t) {
    t.model.id()
    t.model.course()
    t.model.created_at()
    t.model.max_points()
    t.model.n_points()
    t.model.progress()
    t.model.updated_at()
    t.model.user()
    // t.model.user_course_service_progress()

    // t.prismaFields(["*"])

    t.field("UserCourseSettings", {
      type: "UserCourseSettings",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const prisma: Prisma = ctx.prisma
        const course: Course = await prisma
          .userCourseProgress({ id: parent.id })
          .course()
        const user: User = await prisma
          .userCourseProgress({ id: parent.id })
          .user()
        const userCourseSettings: UserCourseSettings[] = await prisma.userCourseSettingses(
          {
            where: {
              course: course,
              user: user,
            },
          },
        )
        // FIXME: what if there's not any?
        return userCourseSettings?.[0] ?? null
      },
    })

    t.field("exercise_progress", {
      type: "exercise_progress",
      resolve: async (parent, _, ctx) => {
        const course: Course = await ctx.prisma
          .userCourseProgress({ id: parent.id })
          .course()
        const user: User = await ctx.prisma
          .userCourseProgress({ id: parent.id })
          .user()

        const courseProgresses = await ctx.prisma.userCourseProgresses({
          where: { course: course, user: user },
        })
        const courseProgress = courseProgresses.length
          ? courseProgresses[0].progress
          : []
        const exercises = await ctx.prisma.course({ id: course.id }).exercises()
        const completedExercises = await ctx.prisma.exerciseCompletions({
          where: { exercise: { course: course }, user: user },
        })

        const totalProgress =
          (courseProgress.reduce(
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
