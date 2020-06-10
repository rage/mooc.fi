import {
  Prisma,
  OpenUniversityRegistrationLink,
} from "../../generated/prisma-client"
import { stringArg, idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addOpenUniversityRegistrationLink = async (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  t.field("addOpenUniversityRegistrationLink", {
    type: "OpenUniversityRegistrationLink",
    args: {
      course_code: stringArg({ required: true }),
      course: idArg({ required: true }),
      language: stringArg(),
      link: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { course_code, course, language, link } = args
      const prisma: Prisma = ctx.prisma

      // FIXME: empty course_code and/or language?
      const openUniversityRegistrationLink: OpenUniversityRegistrationLink = await prisma.createOpenUniversityRegistrationLink(
        {
          course: { connect: { id: course } },
          course_code: course_code ?? "",
          language: language ?? "",
          link: link,
        },
      )
      return openUniversityRegistrationLink
    },
  })
}

const updateOpenUniversityRegistrationLink = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  t.field("updateOpenUniversityRegistrationLink", {
    type: "OpenUniversityRegistrationLink",
    args: {
      id: idArg(),
      course_code: stringArg(),
      course: idArg(),
      language: stringArg(),
      link: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      const { id, course_code, course, language, link } = args
      return prisma.updateOpenUniversityRegistrationLink({
        where: {
          id: id,
        },
        // TODO/FIXME: this deletes the old values?
        data: {
          course: { connect: { id: course } },
          course_code: course_code,
          language: language,
          link: link,
        },
      })
    },
  })
}

const addOpenUniversityRegistrationLinkMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  addOpenUniversityRegistrationLink(t)
  updateOpenUniversityRegistrationLink(t)
}

export default addOpenUniversityRegistrationLinkMutations
