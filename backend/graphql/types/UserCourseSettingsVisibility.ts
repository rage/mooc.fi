import { schema } from "nexus"

schema.objectType({
  name: "user_course_settings_visibility",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course({ alias: "course_id" })
    t.model.course_courseTouser_course_settings_visibility({ alias: "course" })
    t.model.language()
  },
})
