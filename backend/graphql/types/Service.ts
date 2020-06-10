import { schema } from "nexus"

schema.objectType({
  name: "service",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.url()
    t.model.exercise()
    t.model.user_course_service_progress()
    t.model.course()
  },
})
