import { stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseVariant", {
      type: "CourseVariant",
      args: {
        course_id: idArg({ required: true }),
        slug: stringArg({ required: true }),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_id, slug, description } = args

        return ctx.db.courseVariant.create({
          data: {
            slug,
            description,
            course: { connect: { id: course_id } },
          },
        })
      },
    })

    t.field("updateCourseVariant", {
      type: "CourseVariant",
      args: {
        id: idArg({ required: true }),
        slug: stringArg(),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, slug, description } = args

        return ctx.db.courseVariant.update({
          where: { id },
          data: {
            slug: slug ?? undefined,
            description,
          },
        })
      },
    })

    t.field("deleteCourseVariant", {
      type: "CourseVariant",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.db.courseVariant.delete({ where: { id } })
      },
    })
  },
})
