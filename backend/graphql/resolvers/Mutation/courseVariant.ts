import { Prisma } from "../../generated/prisma-client"
import { stringArg, idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addCourseVariant = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourseVariant", {
    type: "CourseVariant",
    args: {
      course_id: idArg({ required: true }),
      slug: stringArg({ required: true }),
      description: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { course_id, slug, description } = args
      const prisma: Prisma = ctx.prisma

      return prisma.createCourseVariant({
        slug,
        description,
        course: { connect: { id: course_id } },
      })
    },
  })
}

const updateCourseVariant = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateCourseVariant", {
    type: "CourseVariant",
    args: {
      id: idArg({ required: true }),
      slug: stringArg(),
      description: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { id, slug, description } = args
      const prisma: Prisma = ctx.prisma

      return prisma.updateCourseVariant({
        where: { id },
        data: { slug, description },
      })
    },
  })
}

const deleteCourseVariant = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteCourseVariant", {
    type: "CourseVariant",
    args: {
      id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.deleteCourseVariant({ id })
    },
  })
}

const addCourseVariantMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addCourseVariant(t)
  updateCourseVariant(t)
  deleteCourseVariant(t)
}

export default addCourseVariantMutations
