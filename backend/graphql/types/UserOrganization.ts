import { schema } from "nexus"

schema.objectType({
  name: "user_organization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.organization()
    t.model.role()
    t.model.user()
  },
})
