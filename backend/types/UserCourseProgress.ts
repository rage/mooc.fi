import { prismaObjectType } from "nexus-prisma"
import {
  UserCourseSettings,
  Prisma,
  Course,
  User,
} from "../generated/prisma-client"

const UserCourseProgress = prismaObjectType({
  name: "UserCourseProgress",
  definition(t) {
    t.prismaFields(["*"])

    t.field("UserCourseSettings", {
      type: "UserCourseSettings",
      resolve: async (parent, args, ctx) => {
        const prisma: Prisma = ctx.prisma
        const course: Course = await prisma
          .userCourseProgress({ id: parent.id })
          .course()
        const user: User = await prisma
          .userCourseProgress({ id: parent.id })
          .user()
        const userCourseSettings: UserCourseSettings[] = await prisma.userCourseSettingses(
          {
            where: {
              course: course,
              user: user,
            },
          },
        )
        return userCourseSettings[0]
      },
    })
  },
})
export default UserCourseProgress
