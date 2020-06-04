import { objectType } from "@nexus/schema"
import Course from "./Course"
import User from "./User"

const Progress = objectType({
  name: "Progress",
  definition(t) {
    t.field("course", { type: Course })
    t.field("user", { type: User })

    t.field("user_course_progress", {
      type: "UserCourseProgress",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const courseId = parent.course.id
        const userId = parent.user.id
        const userCourseProgresses = await ctx.prisma.userCourseProgresses({
          where: { course: { id: courseId }, user: { id: userId } },
        })
        return userCourseProgresses[0]
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        const courseId = parent.course.id
        const userId = parent.user.id
        return ctx.prisma.userCourseServiceProgresses({
          where: { user: { id: userId }, course: { id: courseId } },
        })
      },
    })
  },
})

export default Progress
