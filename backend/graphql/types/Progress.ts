import { schema } from "nexus"

schema.objectType({
  name: "Progress",
  definition(t) {
    t.field("course", { type: "Course" })
    t.field("user", { type: "User" })

    t.field("user_course_progress", {
      type: "UserCourseProgress",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id
        const userCourseProgresses = await ctx.db.userCourseProgress.findMany({
          where: { course_id, user_id },
        })
        return userCourseProgresses[0]
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id
        return ctx.db.userCourseServiceProgress.findMany({
          where: { user_id, course_id },
        })
      },
    })
  },
})
