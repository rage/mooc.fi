import { schema } from "nexus"

schema.objectType({
  name: "OpenUniversityRegistrationLink",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.course_code()
    t.model.language()
    t.model.link()
    t.model.start_date()
    t.model.stop_date()
  },
})
