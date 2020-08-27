"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "UserCourseSettingsVisibility",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.language()
  },
})
nexus_1.schema.inputObjectType({
  name: "UserCourseSettingsVisibilityCreateInput",
  definition: function (t) {
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})
nexus_1.schema.inputObjectType({
  name: "UserCourseSettingsVisibilityUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})
//# sourceMappingURL=UserCourseSettingsVisibility.js.map
