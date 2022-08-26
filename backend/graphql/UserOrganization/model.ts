import { objectType } from "nexus"

export const UserOrganization = objectType({
  name: "UserOrganization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.organization_id()
    t.model.organization()
    t.model.role()
    t.model.user_id()
    t.model.user()
    t.model.confirmed()
    t.model.confirmed_at()
    t.model.consented()
    t.model.organizational_email()
    t.model.organizational_identifier()
    t.model.user_organization_join_confirmations()
  },
})
