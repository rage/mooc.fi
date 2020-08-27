"use strict"
exports.__esModule = true
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "EmailDelivery",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email_template_id()
    t.model.email_template()
    t.model.error()
    t.model.error_message()
    t.model.sent()
    t.model.user_id()
    t.model.user()
  },
})
//# sourceMappingURL=EmailDelivery.js.map
