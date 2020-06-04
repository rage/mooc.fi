import { inputObjectType } from "@nexus/schema"

const StudyModuleTranslationWithIdInput = inputObjectType({
  name: "StudyModuleTranslationWithIdInput",
  definition(t) {
    t.id("id")
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module")
  },
})

export default StudyModuleTranslationWithIdInput
