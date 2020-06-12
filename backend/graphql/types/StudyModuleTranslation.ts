import { schema } from "nexus"

schema.objectType({
  name: "study_module_translation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.description()
    t.model.language()
    t.model.name()
    t.model.study_module({ alias: "study_module_id" })
    t.model.study_module_study_moduleTostudy_module_translation({
      alias: "study_module",
    })
  },
})
