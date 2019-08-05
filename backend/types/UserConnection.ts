import { prismaObjectType } from "nexus-prisma"
import { Prisma } from "../generated/prisma-client"
import { stringArg } from "nexus/dist"

const UserConnection = prismaObjectType({
  name: "UserConnection",
  definition(t) {
    t.prismaFields(["*"])

    t.field("count", {
      type: "Int",
      args: {
        email: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const prisma: Prisma = ctx.prisma
        return await prisma
          .usersConnection({
            where: {
              email_contains: args.email, //tää args ei taida toimia :d
            },
          })
          .aggregate()
          .count()
      },
    })
  },
})
export default UserConnection
