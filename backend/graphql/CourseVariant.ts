import {
  objectType,
  inputObjectType,
  extendType,
  idArg,
  stringArg,
} from "@nexus/schema"
import { isAdmin } from "../accessControl"

export const CourseVariant = objectType({
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

export const CourseVariantCreateInput = inputObjectType({
  name: "CourseVariantCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

export const CourseVariantUpsertInput = inputObjectType({
  name: "CourseVariantUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

export const CourseVariantQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("courseVariant", {
      type: "CourseVariant",
      args: {
        id: idArg({ required: true }),
      },
      nullable: true,
      resolve: (_, { id }, ctx) =>
        ctx.db.courseVariant.findOne({ where: { id: id ?? undefined } }),
    })

    t.list.field("courseVariants", {
      type: "CourseVariant",
      args: {
        course_id: idArg(),
      },
      resolve: (_, { course_id }, ctx) =>
        ctx.db.course
          .findOne({ where: { id: course_id ?? undefined } })
          .course_variants(),
    })
  },
})

export const CourseVariantMutations = extendType({
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
