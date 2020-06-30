import { schema } from "nexus"

schema.objectType({
  name: "progress",
  definition(t) {
    t.field("course", { type: "course" })
    t.field("user", { type: "user" })

    t.field("user_course_progress", {
      type: "user_course_progress",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const course_id = parent.course?.id
        const user_id = parent.user?.id
        const userCourseProgresses = await ctx.db.user_course_progress.findMany(
          {
            where: { course_id, user_id },
          },
        )
        return userCourseProgresses[0]
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "user_course_service_progress",
      resolve: async (parent, _, ctx) => {
        const courseId = parent.course?.id
        const userId = parent.user?.id
        return ctx.db.user_course_service_progress.findMany({
          where: { user: userId, course: courseId },
        })
      },
    })
  },
})
