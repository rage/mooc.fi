import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.courseTranslations({
      filtering: {
        language: true,
      },
      pagination: false,
      authorize: isAdmin,
    })
    /*t.list.field("CourseTranslations", {
      type: "course_translation",
      args: {
        language: stringArg(),
      },
      resolve: (_, args, ctx) => {
        const { language } = args
        checkAccess(ctx, { allowOrganizations: false })
        return ctx.db.course_translation.findMany({ where: { language } })
      },
    })*/
  },
})
