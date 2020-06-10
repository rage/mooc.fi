import { schema } from "nexus"

schema.objectType({
  name: "user_course_service_progress",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.progress()
    t.model.service()
    t.model.timestamp()
    t.model.user()
    t.model.user_course_progress()
  },
})
