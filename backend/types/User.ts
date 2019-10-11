import { prismaObjectType } from "nexus-prisma"
import { idArg, stringArg } from "nexus/dist"
import { Course } from "/generated/prisma-client"

const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields(["*"])

    t.field("progress", {
      type: "Progress",
      nullable: false,
      args: {
        course_id: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const course: Course = await ctx.prisma.course({ id: args.course_id })
        return {
          course: course,
          user: parent,
        }
      },
    })

    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      nullable: true,
      args: {
        course_id: idArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id } = args

        const progresses = await ctx.prisma.userCourseProgresses({
          where: {
            user: { id: parent.id },
            course: { id: course_id },
          },
        })

        if (progresses.length > 0) {
          return progresses[0]
        } else {
          return null
        }
      },
    })
  },
})

export default User
