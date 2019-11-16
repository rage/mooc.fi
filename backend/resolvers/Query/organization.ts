import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg, arg, booleanArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"

const organization = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("organization", {
    type: "Organization",
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
      return (res.length ? res[0] : null) as NexusGenRootTypes["Organization"]
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
    resolve: async (_, args, ctx) => {
      const { first, last, after, before, orderBy, hidden } = args

      if (hidden) {
        checkAccess(ctx)
      }
      const prisma: Prisma = ctx.prisma

      // FIXME: orderBy type bug (?)
      // @ts-ignore
      const orgs = await prisma.organizations({
        first: first ?? undefined,
        last: last ?? undefined,
        after: after ?? undefined,
        before: before ?? undefined,
        orderBy: orderBy ?? undefined,
        where: {
          hidden,
        },
      })

      return orgs as NexusGenRootTypes["Organization"][]
    },
  })
}

const addOrganizationQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  organization(t)
  organizations(t)
}

export default addOrganizationQueries
