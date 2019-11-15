import { inputObjectType } from "nexus/dist"

const StudyModuleArg = inputObjectType({
  name: "StudyModuleArg",
  definition(t) {
    t.id("id", { required: false })
    t.string("slug", { required: false })
    t.string("new_slug", { required: false })
    t.string("name", { required: false })
    t.string("image", { required: false })
    t.int("order", { required: false })
    t.field("study_module_translations", {
      list: true,
      type: "StudyModuleTranslationCreateUpdateInput",
      required: false,
    })
  },
})

export default StudyModuleArg
