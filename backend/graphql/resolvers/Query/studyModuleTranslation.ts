import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.studyModuleTranslations({
      pagination: false,
      authorize: isAdmin,
    })
    /*t.list.field("StudyModuleTranslations", {
      type: "study_module_translation",
      resolve: (_, __, ctx) => {
        // checkAccess(ctx, { allowOrganizations: false })
        return ctx.db.study_module_translation.findMany()
      },
    })*/
  },
})
