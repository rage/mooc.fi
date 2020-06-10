import { Prisma, CourseTranslation } from "../../generated/prisma-client"
import { idArg, stringArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addCourseTranslation = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourseTranslation", {
    type: "CourseTranslation",
    args: {
      language: stringArg({ required: true }),
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
          name: name ?? "",
          description: description ?? "",
          link: link,
          course: { connect: { id: course } },
        },
      )
      return newCourseTranslation
    },
  })
}

const updateCourseTranslation = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateCourseTranslation", {
    type: "CourseTranslation",
    args: {
      id: idArg({ required: true }),
      language: stringArg({ required: true }),
      name: stringArg(),
      description: stringArg(),
      link: stringArg(),
      course: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id, language, name, description, link, course } = args
      const prisma: Prisma = ctx.prisma

      return prisma.updateCourseTranslation({
        where: { id: id },
        data: {
          language: language,
          name: name,
          description: description,
          link: link,
          course: { connect: { id: course } },
        },
      })
    },
  })
}

const deleteCourseTranslation = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteCourseTranslation", {
    type: "CourseTranslation",
    args: {
      id: idArg({ required: true }),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.deleteCourseTranslation({
        id: id,
      })
    },
  })
}
const addCourseTranslationMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  addCourseTranslation(t)
  updateCourseTranslation(t)
  deleteCourseTranslation(t)
}

export default addCourseTranslationMutations
