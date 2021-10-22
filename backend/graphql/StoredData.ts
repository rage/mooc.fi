import { objectType } from "nexus"

export const StoredData = objectType({
  name: "StoredData",
  definition(t) {
    t.model.user_id()
    t.model.course_id()
    t.model.data()
    t.model.created_at()
    t.model.updated_at()
  },
})
