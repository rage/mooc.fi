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
        organization_ids: idArg({ list: true }),
      },
      resolve: async (_, args, ctx) => {
        const { search, course_id, organization_ids } = args

        const prisma: Prisma = ctx.prisma
        return await prisma
          .userCourseSettingsesConnection({
            where: {
              user: {
                organization_memberships_some: organization_ids?.length
                  ? { organization: { id_in: organization_ids } }
                  : undefined,
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
