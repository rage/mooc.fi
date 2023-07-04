import { objectType } from "nexus"

export const CourseOwnership = objectType({
  name: "CourseOwnership",
  definition(t) {
    t.model.id()
    t.model.user_id()
    t.model.course_id()
    t.model.user()
    t.model.course()
    t.model.created_at()
    t.model.updated_at()
  },
})
