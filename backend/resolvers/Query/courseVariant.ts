import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"

const courseVariant = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("courseVariant", {
    type: "CourseVariant",
    args: {
      id: idArg(),
    },
    nullable: true,
    resolve: (_, args, ctx) => {
      const { id } = args

      return ctx.prisma.courseVariant({ id })
    },
  })
}

const courseVariants = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("courseVariants", {
    type: "CourseVariant",
    args: {
      course_id: idArg(),
    },
    resolve: (_, args, ctx) => {
      const { course_id } = args

      return ctx.prisma.course({ id: course_id }).course_variants()
    },
  })
}

const addCourseVariantQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  courseVariant(t)
  courseVariants(t)
}

export default addCourseVariantQueries
