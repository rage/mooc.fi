import {
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

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
    t.nullable.id("course")
    t.nonNull.string("slug")
    t.nullable.string("description")
    t.nullable.string("instructions")
  },
})

export const CourseVariantUpsertInput = inputObjectType({
  name: "CourseVariantUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.nullable.id("course")
    t.nonNull.string("slug")
    t.nullable.string("description")
    t.nullable.string("instructions")
  },
})

export const CourseVariantQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("courseVariant", {
      type: "CourseVariant",
      args: {
        id: nonNull(idArg()),
      },
      resolve: (_, { id }, ctx) =>
        ctx.prisma.courseVariant.findUnique({ where: { id } }),
    })

    t.list.field("courseVariants", {
      type: "CourseVariant",
      args: {
        course_id: idArg(),
      },
      resolve: (_, { course_id }, ctx) => {
        if (course_id) {
          return ctx.prisma.course
            .findUnique({ where: { id: course_id } })
            .course_variants()
        }

        return ctx.prisma.courseVariant.findMany()
      },
    })
  },
})

export const CourseVariantMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseVariant", {
      type: "CourseVariant",
      args: {
        course_id: nonNull(idArg()),
        slug: nonNull(stringArg()),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_id, slug, description } = args

        return ctx.prisma.courseVariant.create({
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
        id: nonNull(idArg()),
        slug: stringArg(),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, slug, description } = args

        return ctx.prisma.courseVariant.update({
          where: { id },
          data: {
            ...(slug && { slug }),
            description,
          },
        })
      },
    })

    t.field("deleteCourseVariant", {
      type: "CourseVariant",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.prisma.courseVariant.delete({ where: { id } })
      },
    })
  },
})
