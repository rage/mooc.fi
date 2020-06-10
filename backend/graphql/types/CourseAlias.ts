import { schema } from "nexus"

schema.objectType({
  name: "course_alias",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course()
    t.model.course_code()
  },
})
