import {
  Prisma,
  OrganizationOrderByInput,
} from "../../../generated/prisma-client"
import { idArg, intArg, arg, booleanArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"
import { schema } from "nexus"

/*schema.queryType({
  definition(t) {
    t.crud.organizations({
      ordering: true,
    })
  },
})
*/
schema.extendType({
  type: "Query",
  definition(t) {
    t.field("organization", {
      type: "organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args
        const prisma: Prisma = ctx.prisma

        if (!hidden) {
          return prisma.organization({ id })
        }

        checkAccess(ctx)
        const res = await prisma.organizations({ where: { id, hidden } })
        return res.length ? res[0] : null
      },
    })

    t.crud.organizations({
      ordering: true,
    })

    t.list.field("organizations", {
      type: "organization",
      ordering: true,
      args: {
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
        // orderBy: arg({ type: "organizationOrderByInput" }),
        hidden: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const { first, last, after, before, orderBy, hidden } = args

        if (hidden) {
          checkAccess(ctx)
        }
        const prisma: Prisma = ctx.prisma

        const orgs = await prisma.organizations({
          first: first ?? undefined,
          last: last ?? undefined,
          after: after ?? undefined,
          before: before ?? undefined,
          orderBy: (orderBy as OrganizationOrderByInput) ?? undefined,
          where: {
            hidden,
          },
        })

        return orgs
      },
    })
  },
})

/**/

const addOrganizationQueries = (t: ObjectDefinitionBlock<"Query">) => {
  // organization(t)
  // organizations(t)
}

export default addOrganizationQueries
