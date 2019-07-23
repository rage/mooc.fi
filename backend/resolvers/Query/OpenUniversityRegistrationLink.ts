import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const openUniversityRegistrationLink = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.field("openUniversityRegistrationLink", {
    type: "OpenUniversityRegistrationLink",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.openUniversityRegistrationLink({
        id: id,
      })
    },
  })
}

const openUniversityRegistrationLinks = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.list.field("openUniversityRegistrationLinks", {
    type: "OpenUniversityRegistrationLink",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.openUniversityRegistrationLinks()
    },
  })
}

const addOpenUniversityRegistrationLinkQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  openUniversityRegistrationLink(t)
  openUniversityRegistrationLinks(t)
}

export default addOpenUniversityRegistrationLinkQueries
