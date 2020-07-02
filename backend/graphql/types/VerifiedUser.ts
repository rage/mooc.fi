import { schema } from "nexus"

schema.objectType({
  name: "VerifiedUser",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.display_name()
    t.model.organization_id()
    t.model.organization()
    t.model.personal_unique_code()
    t.model.user_id()
    t.model.user()
  },
})
