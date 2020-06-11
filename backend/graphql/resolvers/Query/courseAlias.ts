import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.courseAliases()
    /*t.list.field("CourseAliases", {
      type: "course_alias",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.course_alias.findMany()
      },
    })*/
  },
})
