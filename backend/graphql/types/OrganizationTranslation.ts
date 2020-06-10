import { schema } from "nexus"

schema.objectType({
  name: "organization_translation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.disabled_reason()
    t.model.information()
    t.model.language()
    t.model.name()
    t.model.organization()
  },
})
