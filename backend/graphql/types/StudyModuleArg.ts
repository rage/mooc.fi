import { schema } from "nexus"

schema.inputObjectType({
  name: "StudyModuleCreateArg",
  definition(t) {
    t.string("slug", { required: true })
    t.string("name", { required: false })
    t.string("image", { required: false })
    t.int("order", { required: false })
    t.field("study_module_translation", {
      list: true,
      type: "study_module_translationUpsertInput",
      required: false,
    })
  },
})

schema.inputObjectType({
  name: "StudyModuleUpsertArg",
  definition(t) {
    t.id("id", { required: false })
    t.string("slug", { required: true })
    t.string("new_slug", { required: false })
    t.string("name", { required: false })
    t.string("image", { required: false })
    t.int("order", { required: false })
    t.field("study_module_translation", {
      list: true,
      type: "study_module_translationUpsertInput",
      required: false,
    })
  },
})
