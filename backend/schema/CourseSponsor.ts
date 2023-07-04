import { objectType } from "nexus"

export const CourseSponsor = objectType({
  name: "CourseSponsor",
  definition(t) {
    t.model.course_id()
    t.model.sponsor_id()
    t.model.order()
    t.model.course()
    t.model.sponsor()
    t.model.created_at()
    t.model.updated_at()
  },
})
