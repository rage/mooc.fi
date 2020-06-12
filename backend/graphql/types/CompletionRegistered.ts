import { schema } from "nexus"

schema.objectType({
  name: "completion_registered",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion({ alias: "completion_id" })
    t.model.course({ alias: "course_id" })
    t.model.organization({ alias: "organization_id" })
    t.model.real_student_number()
    t.model.user({ alias: "user_id" })
    t.model.completion_completionTocompletion_registered({
      alias: "completion",
    })
    t.model.course_completion_registeredTocourse({ alias: "course" })
    t.model.organization_completion_registeredToorganization({
      alias: "organization",
    })
    t.model.user_completion_registeredTouser({ alias: "user" })
  },
})
