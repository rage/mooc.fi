import { objectType } from "nexus"

export const CourseTag = objectType({
  name: "CourseTag",
  definition(t) {
    t.model.course_id()
    t.model.tag_id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course()
    t.model.tag()
  },
})
