import { schema } from "nexus"

schema.objectType({
  name: "StudyModuleTranslation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.description()
    t.model.language()
    t.model.name()
    t.model.study_module_id()
    t.model.study_module()
  },
})
