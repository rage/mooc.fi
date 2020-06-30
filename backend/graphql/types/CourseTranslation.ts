import { schema } from "nexus"

schema.objectType({
  name: "course_translation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.language()
    t.model.link()
    t.model.name()
  },
})
