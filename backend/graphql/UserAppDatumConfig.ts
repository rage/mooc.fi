import { objectType } from "nexus"

export const UserAppDatumConfig = objectType({
  name: "UserAppDatumConfig",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.timestamp()
  },
})
