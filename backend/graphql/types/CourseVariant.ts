import { schema } from "nexus"

schema.objectType({
  name: "course_variant",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course({ alias: "course_id" })
    t.model.course_courseTocourse_variant({ alias: "course" })
    t.model.description()
    t.model.slug()
  },
})
