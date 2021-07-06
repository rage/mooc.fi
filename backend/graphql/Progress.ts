import { objectType } from "nexus"

export const Progress = objectType({
  name: "Progress",
  definition(t) {
    t.nullable.field("course", { type: "Course" })
    t.field("user", { type: "User" })

    t.nullable.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id

        const user_course_progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_progresses({
            where: { user_id },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return user_course_progresses?.[0] ?? null
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id

        const user_course_service_progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_service_progresses({
            where: { user_id },
          })

        return user_course_service_progresses ?? []
        /*return ctx.prisma.userCourseServiceProgress.findMany({
          where: { user_id, course_id },
        })*/
      },
    })
  },
})
