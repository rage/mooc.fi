import { schema } from "nexus"

schema.objectType({
  name: "completion_registered",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion()
    t.model.course()
    t.model.organization()
    t.model.real_student_number()
    t.model.user()
  },
})
