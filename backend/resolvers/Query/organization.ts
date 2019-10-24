import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg, arg, booleanArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const organization = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("organization", {
    type: "Organization",
    args: {
      id: idArg(),
      hidden: booleanArg(),
    },
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
}

const organizations = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("organizations", {
    type: "Organization",
    args: {
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
      orderBy: arg({ type: "OrganizationOrderByInput" }),
      hidden: booleanArg(),
    },
    resolve: (_, args, ctx) => {
      const { first, last, after, before, orderBy, hidden } = args

      if (hidden) {
        checkAccess(ctx)
      }
      const prisma: Prisma = ctx.prisma

      return prisma.organizations({
        first: first,
        last: last,
        after: after,
        before: before,
        orderBy,
        where: {
          hidden,
        },
      })
    },
  })
}

const addOrganizationQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  organization(t)
  organizations(t)
}

export default addOrganizationQueries
