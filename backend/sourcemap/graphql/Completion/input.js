"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.inputObjectType({
  name: "CompletionArg",
  definition: function (t) {
    t.string("completion_id", { required: true })
    t.string("student_number", { required: true })
    t.boolean("eligible_for_ects", { required: false })
  },
})
nexus_1.schema.inputObjectType({
  name: "ManualCompletionArg",
  definition: function (t) {
    t.string("user_id", { required: true })
    t.string("grade", { required: false })
    t.field("completion_date", { type: "DateTime", required: false })
  },
})
//# sourceMappingURL=input.js.map
