import {
  booleanArg,
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"

export const CourseAlias = objectType({
  name: "CourseAlias",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.course_code()
  },
})

export const CourseAliasCreateInput = inputObjectType({
  name: "CourseAliasCreateInput",
  definition(t) {
    t.nullable.id("course")
    t.nonNull.string("course_code")
  },
})

export const CourseAliasUpsertInput = inputObjectType({
  name: "CourseAliasUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.nullable.id("course")
    t.nonNull.string("course_code")
  },
})

export const CourseAliasQueries = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("courseAliases", {
      type: "CourseAlias",
      args: {
        course_id: nullable(idArg()),
        course_code: nullable(stringArg()),
        slug: nullable(stringArg()),
        exact: booleanArg({ default: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, slug, course_code, exact }, ctx) =>
        ctx.prisma.courseAlias.findMany({
          where: {
            course_id,
            ...(slug && {
              course: {
                ...(exact
                  ? { slug }
                  : { slug: { contains: slug, mode: "insensitive" } }),
              },
            }),
            ...(course_code && {
              ...(exact
                ? { course_code }
                : {
                    course_code: { contains: course_code, mode: "insensitive" },
                  }),
            }),
          },
        }),
    })
  },
})

export const CourseAliasMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: nonNull(stringArg()),
        course: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?

        const newCourseAlias = await ctx.prisma.courseAlias.create({
          data: {
            course_code: course_code ?? "",
            course: { connect: { id: course } },
          },
        })
        return newCourseAlias
      },
    })
  },
})
