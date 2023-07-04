import { objectType } from "nexus"

export const OrganizationTranslation = objectType({
  name: "OrganizationTranslation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.information()
    t.model.language()
    t.model.name()
    t.model.organization_id()
    t.model.organization()
  },
})
