import { arg, booleanArg, extendType, nonNull, stringArg } from "nexus"

import { isAdmin, isUser, or, Role } from "../../accessControl"
import { Context } from "../../context"
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenError,
} from "../../lib/errors"
import { invalidate } from "../../services/redis"
import { hashUser } from "../../util"
import { ConflictError } from "../common"

export const UserMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUserName", {
      type: "User",
      args: {
        first_name: stringArg(),
        last_name: stringArg(),
      },
      resolve: async (_, { first_name, last_name }, ctx: Context) => {
        const { user: currentUser } = ctx
        const authorization = ctx?.req?.headers?.authorization

        if (!currentUser) {
          throw new GraphQLAuthenticationError("not logged in")
        }

        const access_token = authorization?.split(" ")[1]

        await invalidate("userdetails", `Bearer ${access_token}`)
        await invalidate("user", hashUser(currentUser))

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
      resolve: async (_, { value }, ctx: Context) => {
        const { user: currentUser } = ctx
        const authorization = ctx?.req?.headers?.authorization

        if (!currentUser) {
          throw new GraphQLAuthenticationError("not logged in")
        }

        const access_token = authorization?.split(" ")[1]

        await invalidate("userdetails", `Bearer ${access_token}`)
        await invalidate("user", hashUser(currentUser))

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
            type: "UserCreateArg",
          }),
        ),
      },
      resolve: async (_, { user }, ctx) => {
        const exists = await ctx.prisma.user.findFirst({
          select: { id: true },
          where: { upstream_id: user.upstream_id },
        })

        if (exists) {
          throw new ConflictError("user with that upstream id already exists")
        }

        return ctx.prisma.user.create({
          data: {
            ...user,
            administrator: false,
          },
        })
      },
    })

    t.field("updateUser", {
      type: "User",
      args: {
        user: nonNull(
          arg({
            type: "UserUpdateArg",
          }),
        ),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { user }, ctx) => {
        const { id, email, ...rest } = user
        const { user: currentUser } = ctx

        if (!currentUser) {
          throw new GraphQLAuthenticationError("not logged in")
        }

        if (ctx.role !== Role.ADMIN && id && currentUser.id !== id) {
          throw new GraphQLForbiddenError("invalid credentials to do that")
        }

        // TODO: sync changes with TMC here?
        return ctx.prisma.user.update({
          where: { id: id ?? currentUser.id },
          data: {
            ...rest,
            ...(email ? { email } : {}), // can't be null
          },
        })
      },
    })
  },
})
