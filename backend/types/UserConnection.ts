import { prismaObjectType } from "nexus-prisma"
import { Prisma } from "../generated/prisma-client"
import { stringArg } from "nexus/dist"
import { buildSearch } from "../util/db-functions"

const UserConnection = prismaObjectType({
  name: "UserConnection",
  definition(t) {
    t.prismaFields(["*"])

    t.field("count", {
      type: "Int",
      args: {
        search: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { search } = args
        const prisma: Prisma = ctx.prisma
        return await prisma
          .usersConnection({
            where: {
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
          })
          .aggregate()
          .count()
      },
    })
  },
})
export default UserConnection
