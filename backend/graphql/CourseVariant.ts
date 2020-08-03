import { schema } from "nexus"

import { isAdmin } from "../accessControl"

schema.objectType({
  name: "CourseVariant",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.slug()
  },
})

schema.inputObjectType({
  name: "CourseVariantCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

schema.inputObjectType({
  name: "CourseVariantUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("courseVariant", {
      type: "CourseVariant",
      args: {
        id: schema.idArg({ required: true }),
      },
      nullable: true,
      resolve: (_, { id }, ctx) =>
        ctx.db.courseVariant.findOne({ where: { id: id ?? undefined } }),
    })

    t.list.field("courseVariants", {
      type: "CourseVariant",
      args: {
        course_id: schema.idArg(),
      },
      resolve: (_, { course_id }, ctx) =>
        ctx.db.course
          .findOne({ where: { id: course_id ?? undefined } })
          .course_variants(),
    })
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseVariant", {
      type: "CourseVariant",
      args: {
        course_id: schema.idArg({ required: true }),
        slug: schema.stringArg({ required: true }),
        description: schema.stringArg(),
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
        id: schema.idArg({ required: true }),
        slug: schema.stringArg(),
        description: schema.stringArg(),
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
        id: schema.idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.db.courseVariant.delete({ where: { id } })
      },
    })
  },
})
