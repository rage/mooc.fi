import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg, arg } from "nexus/dist"
import checkAccess from "../../accessControl"

const organization = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("organization", {
    type: "Organization",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.organization({ id: id })
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
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { first, last, after, before, orderBy } = args
      const prisma: Prisma = ctx.prisma

      return prisma.organizations({
        first: first,
        last: last,
        after: after,
        before: before,
        orderBy,
      })
    },
  })
}

const addOrganizationQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  organization(t)
  organizations(t)
}

export default addOrganizationQueries
