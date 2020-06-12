import { schema } from "nexus"

schema.objectType({
  name: "course_alias",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course({ alias: "course_id" })
    t.model.course_courseTocourse_alias({ alias: "course" })
    t.model.course_code()
  },
})
