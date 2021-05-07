import { objectType } from "nexus"

export const Progress = objectType({
  name: "Progress",
  definition(t) {
    t.nullable.field("course", { type: "Course" })
    t.field("user", { type: "User" })

    t.nullable.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async ({ course, user }, _, ctx) => {
        return ctx.prisma.userCourseProgress.findFirst({
          where: { course_id: course?.id, user_id: user?.id },
          orderBy: { created_at: "asc" },
        })
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async ({ course, user }, _, ctx) => {
        return ctx.prisma.userCourseServiceProgress.findMany({
          where: { user_id: user?.id, course_id: course?.id },
        })
      },
    })
  },
})
