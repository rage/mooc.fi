import { schema } from "nexus"
import { stringArg, idArg } from "@nexus/schema"
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
    t.crud.courseVariant()
    t.crud.courseVariants({
      filtering: {
        course_id: true,
      },
      pagination: false,
    })
    /*t.field("courseVariant", {
      type: "course_variant",
      args: {
        id: idArg(),
      },
      nullable: true,
      resolve: (_, args, ctx) => {
        const { id } = args

        return ctx.db.course_variant.findOne({ where: { id } })
      },
    })

    t.list.field("courseVariants", {
      type: "course_variant",
      args: {
        course_id: idArg(),
      },
      resolve: (_, args, ctx) => {
        const { course_id } = args

        return ctx.db.course.findOne({ where: { id: course_id } }).course_variant()
      },
    })*/
  },
})

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
