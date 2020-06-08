import { Prisma } from "../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const openUniversityRegistrationLink = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("openUniversityRegistrationLink", {
    type: "open_university_registration_link",
    args: {
      id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma

      const link = await prisma.openUniversityRegistrationLink({
        id: id,
      })

      return link as NexusGenRootTypes["OpenUniversityRegistrationLink"]
    },
  })
}

const openUniversityRegistrationLinks = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("openUniversityRegistrationLinks", {
    type: "open_university_registration_link",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.openUniversityRegistrationLinks()
    },
  })
}

const addOpenUniversityRegistrationLinkQueries = (
  t: ObjectDefinitionBlock<"Query">,
) => {
  openUniversityRegistrationLink(t)
  openUniversityRegistrationLinks(t)
}

export default addOpenUniversityRegistrationLinkQueries
