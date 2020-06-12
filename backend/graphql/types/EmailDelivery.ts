import { schema } from "nexus"

schema.objectType({
  name: "email_delivery",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email_template({ alias: "email_template_id" })
    t.model.email_template_email_deliveryToemail_template({
      alias: "email_template",
    })
    t.model.error()
    t.model.error_message()
    t.model.sent()
    t.model.user({ alias: "user_id" })
    t.model.user_email_deliveryTouser({ alias: "user" })
  },
})
