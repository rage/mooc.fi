import { idArg, intArg, arg, booleanArg } from "@nexus/schema"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-errors"
import { Role } from "../../../accessControl"

const organizationPermission = (
  _: any,
  args: any,
  ctx: NexusContext,
  _info: any,
) => {
  if (args.hidden) return ctx.role === Role.ADMIN

  return true
}

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("organization", {
      type: "Organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args

        if (!id) {
          throw new UserInputError("must provide id")
        }

        /*if (!hidden) {
          return ctx.db.organization.findOne({ where: { id } })
        }*/

        const res = await ctx.db.organization.findMany({
          where: { id, hidden },
        })
        return res.length ? res[0] : null
      },
    })

    t.crud.organizations({
      ordering: true,
      pagination: true,
      authorize: organizationPermission,
    })

    t.list.field("organizations", {
      type: "Organization",
      args: {
        take: intArg(),
        skip: intArg(),
        cursor: arg({ type: "OrganizationWhereUniqueInput" }),
        /*first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),*/
        orderBy: arg({ type: "OrganizationOrderByInput" }),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      resolve: async (_, args, ctx) => {
        const {
          /*first, last, after, before, */ take,
          skip,
          cursor,
          orderBy,
          hidden,
        } = args

        const orgs = await ctx.db.organization.findMany({
          take: take ?? undefined,
          skip: skip ?? undefined,
          cursor: cursor
            ? {
                id: cursor.id ?? undefined,
              }
            : undefined,
          /*first: first ?? undefined,
          last: last ?? undefined,
          after: after ? { id: after } : undefined,
          before: before ? { id: before } : undefined,*/
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
