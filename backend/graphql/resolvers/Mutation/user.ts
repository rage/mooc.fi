import { stringArg, booleanArg, arg } from "@nexus/schema"
import { AuthenticationError } from "apollo-server-errors"
import { invalidate } from "../../../services/redis"
import { schema } from "nexus"
import { NexusContext } from "/context"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateUserName", {
      type: "user",
      args: {
        first_name: stringArg(),
        last_name: stringArg(),
      },
      resolve: (_, { first_name, last_name }, ctx: NexusContext) => {
        const {
          user: currentUser,
          headers: { authorization },
        } = ctx

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }
        const access_token = authorization?.split(" ")[1]

        invalidate("userdetails", `Bearer ${access_token}`)

        return ctx.db.user.update({
          where: { id: currentUser.id },
          data: {
            first_name,
            last_name,
          },
        })
      },
    })

    t.field("updateResearchConsent", {
      type: "user",
      args: {
        value: booleanArg({ required: true }),
      },
      resolve: (_, { value }, ctx) => {
        const {
          user: currentUser,
          headers: { authorization },
        } = ctx

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }

        const access_token = authorization?.split(" ")[1]

        invalidate("userdetails", `Bearer ${access_token}`)

        return ctx.db.user.update({
          where: { id: currentUser.id },
          data: {
            research_consent: value,
          },
        })
      },
    })

    t.field("addUser", {
      type: "user",
      args: {
        user: arg({
          type: "UserArg",
          required: true,
        }),
      },
      resolve: async (_, { user }, ctx) => {
        const exists = await ctx.db.user.findMany({
          where: { upstream_id: user.upstream_id },
        })

        if (exists.length > 0) {
          throw new Error("user with that upstream id already exists")
        }

        return ctx.db.user.create({
          data: {
            ...user,
            administrator: false,
          },
        })
      },
    })
  },
})
