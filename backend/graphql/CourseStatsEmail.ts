import { objectType } from "nexus"

export const CourseStatsEmail = objectType({
  name: "CourseStatsEmail",
  definition(t) {
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.email()
    t.model.created_at()
    t.model.updated_at()
    t.model.last_sent_at()
  },
})
