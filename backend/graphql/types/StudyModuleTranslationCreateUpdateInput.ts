import { schema } from "nexus"

schema.inputObjectType({
  name: "StudyModuleTranslationCreateInput",
  definition(t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})

schema.inputObjectType({
  name: "StudyModuleTranslationUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})
