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
      nullable: true,
      resolve: async (parent, _, ctx) => {
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
        // FIXME: what if there's not any?
        return userCourseSettings?.[0] ?? null
      },
    })
  },
})
export default UserCourseProgress
