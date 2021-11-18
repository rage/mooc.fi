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

        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id }
          })
          .user_course_progresses({
            where: { user_id },
            orderBy: { created_at: "asc" } 
          }) 
        
        return progresses?.[0] ?? null
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id

        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id }
          })
          .user_course_service_progresses({
            where: { user_id },
          })

        return progresses ?? []
      },
    })
  },
})
