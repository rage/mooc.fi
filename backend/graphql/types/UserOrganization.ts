import { schema } from "nexus"

schema.objectType({
  name: "user_organization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.organization({ alias: "organization_id" })
    t.model.organization_organizationTouser_organization({
      alias: "organization",
    })
    t.model.role()
    t.model.user({ alias: "user_id" })
    t.model.user_userTouser_organization({ alias: "user" })
  },
})
