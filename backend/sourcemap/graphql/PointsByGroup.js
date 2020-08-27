"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.inputObjectType({
  name: "PointsByGroup",
  definition: function (t) {
    t.string("group", { required: true })
    t.int("max_points", { required: true })
    t.int("n_points", { required: true })
    t.float("progress", { required: true })
  },
})
//# sourceMappingURL=PointsByGroup.js.map
