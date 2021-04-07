import { AuthenticationError } from "apollo-server-core"
import { invalidate } from "../../services/redis"
import { extendType, stringArg, booleanArg, arg, nonNull } from "nexus"
import { Context } from "../../context"
import hashUser from "../../util/hashUser"

export const UserMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUserName", {
      type: "User",
      args: {
        first_name: stringArg(),
        last_name: stringArg(),
      },
      resolve: (_, { first_name, last_name }, ctx: Context) => {
        const { user: currentUser } = ctx
        const authorization = ctx?.req?.headers?.authorization

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }
        const access_token = authorization?.split(" ")[1]

        invalidate("userdetails", `Bearer ${access_token}`)
        invalidate("user", hashUser(currentUser))

        return ctx.prisma.user.update({
          where: { id: currentUser.id },
          data: {
            first_name,
            last_name,
          },
        })
      },
    })

    t.field("updateResearchConsent", {
      type: "User",
      args: {
        value: nonNull(booleanArg()),
      },
      resolve: (_, { value }, ctx: Context) => {
        const { user: currentUser } = ctx
        const authorization = ctx?.req?.headers?.authorization

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }

        const access_token = authorization?.split(" ")[1]

        invalidate("userdetails", `Bearer ${access_token}`)
        invalidate("user", hashUser(currentUser))

        return ctx.prisma.user.update({
          where: { id: currentUser.id },
          data: {
            research_consent: { set: value },
          },
        })
      },
    })

    t.field("addUser", {
      type: "User",
      args: {
        user: nonNull(
          arg({
            type: "UserArg",
          }),
        ),
      },
      resolve: async (_, { user }, ctx) => {
        const exists = await ctx.prisma.user.findFirst({
          select: { id: true },
          where: { upstream_id: user.upstream_id },
        })

        if (exists) {
          throw new Error("user with that upstream id already exists")
        }

        return ctx.prisma.user.create({
          data: {
            ...user,
            administrator: false
          },
        })
      },
    })
  },
})
