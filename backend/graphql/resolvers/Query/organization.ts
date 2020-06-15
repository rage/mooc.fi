import { idArg, intArg, arg, booleanArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-core"

schema.extendType({
  type: "Query",
  definition(t) {
    // TODO: handle the conditional access restriction with shield rule somehow
    t.field("organization", {
      type: "organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args

        if (!id) {
          throw new UserInputError("must provide id")
        }

        if (!hidden) {
          return ctx.db.organization.findOne({ where: { id } })
        }

        checkAccess(ctx)
        const res = await ctx.db.organization.findMany({
          where: { id, hidden },
        })
        return res.length ? res[0] : null
      },
    })

    t.crud.organizations({
      ordering: true,
      pagination: true,
    })

    // TODO: handle the conditional access restriction with shield rule somehow
    t.list.field("organizations", {
      type: "organization",
      args: {
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
        orderBy: arg({ type: "organizationOrderByInput" }),
        hidden: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const { first, last, after, before, orderBy, hidden } = args

        if (hidden) {
          checkAccess(ctx)
        }

        const orgs = await ctx.db.organization.findMany({
          first: first ?? undefined,
          last: last ?? undefined,
          after: after ?? { id: after },
          before: { id: before },
          orderBy: orderBy ?? undefined,
          where: {
            hidden,
          },
        })

        return orgs
      },
    })
  },
})
