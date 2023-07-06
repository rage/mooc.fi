import { objectType } from "nexus"

export const Progress = objectType({
  name: "Progress",
  definition(t) {
    t.field("user", { type: "User" })
    t.id("course_id")
    t.id("user_id")

    t.field("course", {
      type: "Course",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course_id

        if (!course_id) {
          return null
        }

        return ctx.prisma.course.findUnique({
          where: { id: course_id },
        })
      },
    })

    t.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course_id
        const user_id = parent.user_id

        if (!course_id) {
          return null
        }

        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_progresses({
            where: { user_id },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return progresses?.[0] ?? null
      },
    })

    t.list.nonNull.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course_id
        const user_id = parent.user_id

        if (!course_id) {
          return null
        }

        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_service_progresses({
            where: { user_id },
            distinct: ["course_id", "service_id", "user_id"],
            orderBy: { created_at: "asc" },
          })

        return progresses ?? []
      },
    })
  },
})
