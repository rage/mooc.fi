import { inputObjectType } from "@nexus/schema"

const StudyModuleTranslationCreateUpdateInput = inputObjectType({
  name: "StudyModuleTranslationCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})

export default StudyModuleTranslationCreateUpdateInput
