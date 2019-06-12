import { Prisma, CourseTranslation } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addCourseTranslation = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("addCourseTranslation", {
    type: "CourseTranslation",
    args: {
      language: stringArg(),
      name: stringArg(),
      description: stringArg(),
      link: stringArg(),
      course: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { language, name, description, link, course } = args
      const prisma: Prisma = ctx.prisma
      const newCourseTranslation: CourseTranslation = await prisma.createCourseTranslation(
        {
          language: language,
          name: name,
          description: description,
          link: link,
          course: { connect: { id: course } },
        },
      )
      return newCourseTranslation
    },
  })
}

const addCourseTranslationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addCourseTranslation(t)
}

export default addCourseTranslationMutations
