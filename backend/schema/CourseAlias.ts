import {
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"
import { GraphQLUserInputError } from "../lib/errors"

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
    t.id("course")
    t.nonNull.string("course_code")
  },
})

export const CourseAliasUpsertInput = inputObjectType({
  name: "CourseAliasUpsertInput",
  definition(t) {
    t.id("id")
    t.id("course")
    t.nonNull.string("course_code")
  },
})

export const CourseAliasQueries = extendType({
  type: "Query",
  definition(t) {
    t.crud.courseAliases({
      authorize: isAdmin,
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
      validate: async (_, { course_code, course }) => {
        if (!course_code || !course) {
          throw new GraphQLUserInputError(
            "course code and course are both required",
            ["course_code", "course"],
          )
        }
      },
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?

        return ctx.prisma.courseAlias.create({
          data: {
            course_code: course_code ?? "",
            course: { connect: { id: course } },
          },
        })
      },
    })
  },
})
