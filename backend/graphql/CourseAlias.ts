import {
  objectType,
  inputObjectType,
  extendType,
  idArg,
  stringArg,
} from "@nexus/schema"
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
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

export const CourseAliasUpsertInput = inputObjectType({
  name: "CourseAliasUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

export const CourseAliasQueries = extendType({
  type: "Query",
  definition(t) {
    t.crud.courseAliases({
      authorize: isAdmin,
    })
    /*t.list.field("CourseAliases", {
      type: "course_alias",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.course_alias.findMany()
      },
    })*/
  },
})

export const CourseAliasMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: stringArg({ required: true }),
        course: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?

        const newCourseAlias = await ctx.db.courseAlias.create({
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
