"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.inputObjectType({
  name: "StudyModuleCreateArg",
  definition: function (t) {
    t.string("slug", { required: true })
    t.string("name", { required: false })
    t.string("image", { required: false })
    t.int("order", { required: false })
    t.field("study_module_translations", {
      list: true,
      type: "StudyModuleTranslationUpsertInput",
      required: false,
    })
  },
})
nexus_1.schema.inputObjectType({
  name: "StudyModuleUpsertArg",
  definition: function (t) {
    t.id("id", { required: false })
    t.string("slug", { required: true })
    t.string("new_slug", { required: false })
    t.string("name", { required: false })
    t.string("image", { required: false })
    t.int("order", { required: false })
    t.field("study_module_translations", {
      list: true,
      type: "StudyModuleTranslationUpsertInput",
      required: false,
    })
  },
})
//# sourceMappingURL=input.js.map
