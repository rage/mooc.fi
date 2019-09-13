import { prismaObjectType } from "nexus-prisma"
import { Prisma } from "../generated/prisma-client"
import { idArg, stringArg } from "nexus/dist"

const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields(["*"])

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
