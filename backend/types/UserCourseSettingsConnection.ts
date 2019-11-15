import { prismaObjectType } from "nexus-prisma"
import { Prisma } from "../generated/prisma-client"
import { stringArg, idArg } from "nexus/dist"
import { buildSearch } from "../util/db-functions"

const UserCourseSettingsConnection = prismaObjectType({
  name: "UserCourseSettingsConnection",
  definition(t) {
    t.prismaFields(["*"])

    t.field("count", {
      type: "Int",
      args: {
        course_id: idArg(),
        search: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { search, course_id } = args

        const prisma: Prisma = ctx.prisma
        return await prisma
          .userCourseSettingsesConnection({
            where: {
              user: {
                OR: buildSearch(
                  [
                    "first_name_contains",
                    "last_name_contains",
                    "username_contains",
                    "email_contains",
                  ],
                  search ?? "",
                ),
              },
              course: { id: course_id },
            },
          })
          .aggregate()
          .count()
      },
    })
  },
})

export default UserCourseSettingsConnection
