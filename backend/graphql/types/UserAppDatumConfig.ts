import { schema } from "nexus"

schema.objectType({
  name: "UserAppDatumConfig",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.timestamp()
  },
})
