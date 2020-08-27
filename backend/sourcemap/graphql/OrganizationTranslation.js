"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "OrganizationTranslation",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.disabled_reason()
    t.model.information()
    t.model.language()
    t.model.name()
    t.model.organization_id()
    t.model.organization()
  },
})
//# sourceMappingURL=OrganizationTranslation.js.map
