import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

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
