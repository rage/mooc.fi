import { schema } from "nexus"
import { isAdmin } from "../accessControl"

schema.objectType({
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

schema.inputObjectType({
  name: "CourseAliasCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

schema.inputObjectType({
  name: "CourseAliasUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

schema.extendType({
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

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: schema.stringArg({ required: true }),
        course: schema.idArg({ required: true }),
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
