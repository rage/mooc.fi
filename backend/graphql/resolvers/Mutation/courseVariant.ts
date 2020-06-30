import { stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseVariant", {
      type: "course_variant",
      args: {
        course_id: idArg({ required: true }),
        slug: stringArg({ required: true }),
        description: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, slug, description } = args

        return ctx.db.course_variant.create({
          data: {
            slug,
            description,
            course: { connect: { id: course_id } },
          },
        })
      },
    })

    t.field("updateCourseVariant", {
      type: "course_variant",
      args: {
        id: idArg({ required: true }),
        slug: stringArg(),
        description: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id, slug, description } = args

        return ctx.db.course_variant.update({
          where: { id },
          data: {
            slug: slug ?? undefined,
            description,
          },
        })
      },
    })

    t.field("deleteCourseVariant", {
      type: "course_variant",
      args: {
        id: idArg({ required: true }),
      },
      resolve: async (_, { id }, ctx) => {
        return ctx.db.course_variant.delete({ where: { id } })
      },
    })
  },
})
