import { UserInputError } from "apollo-server-express"
import { objectType } from "nexus"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.id("course_id")
    t.id("user_id")
    t.field("course", { type: "Course" })
    t.field("completion", {
      type: "Completion",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        return ctx.prisma.completion.findFirst({
          where: {
            user_id,
            course_id,
          },
          orderBy: { created_at: "asc" },
        })
      },
    })
    t.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        return ctx.prisma.userCourseProgress.findFirst({
          where: {
            user_id,
            course_id,
          },
          orderBy: { created_at: "asc" },
        })
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        return ctx.prisma.userCourseServiceProgress.findMany({
          where: {
            user_id,
            course_id,
          },
        })
      },
    })

    t.list.field("exercise_completions", { type: "ExerciseCompletion" })
  },
})
