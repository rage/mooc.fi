import { objectType } from "@nexus/schema"

const EmailDelivery = objectType({
  name: "email_delivery",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email_template()
    t.model.error()
    t.model.error_message()
    t.model.sent()
    t.model.user()
  },
})

export default EmailDelivery
