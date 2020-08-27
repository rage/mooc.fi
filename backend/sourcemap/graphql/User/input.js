"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.inputObjectType({
  name: "UserArg",
  definition: function (t) {
    t.int("upstream_id", { required: true })
    t.string("first_name", { required: true })
    t.string("last_name", { required: true })
    t.string("username", { required: true })
    t.string("email", { required: true })
    t.boolean("research_consent", { required: true })
  },
})
//# sourceMappingURL=input.js.map
