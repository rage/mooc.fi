import { idArg } from "@nexus/schema"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const courseVariant = async (t: ObjectDefinitionBlock<"Query">) => {
  t.field("courseVariant", {
    type: "course_variant",
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

const courseVariants = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("courseVariants", {
    type: "course_variant",
    args: {
      course_id: idArg(),
    },
    resolve: (_, args, ctx) => {
      const { course_id } = args

      return ctx.prisma.course({ id: course_id }).course_variants()
    },
  })
}

const addCourseVariantQueries = (t: ObjectDefinitionBlock<"Query">) => {
  courseVariant(t)
  courseVariants(t)
}

export default addCourseVariantQueries
