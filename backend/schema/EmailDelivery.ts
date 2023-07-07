import { objectType } from "nexus"

export const EmailDelivery = objectType({
  name: "EmailDelivery",
  definition(t) {
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
    t.model.email()
    t.model.organization_id()
    t.model.organization()
    t.model.user_organization_join_confirmation()
  },
})
