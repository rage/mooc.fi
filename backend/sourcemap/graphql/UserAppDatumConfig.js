"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "UserAppDatumConfig",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.timestamp()
  },
})
//# sourceMappingURL=UserAppDatumConfig.js.map
