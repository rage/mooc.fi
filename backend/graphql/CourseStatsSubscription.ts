import { objectType } from "nexus"

export const CourseStatsSubscription = objectType({
  name: "CourseStatsSubscription",
  definition(t) {
    t.model.id()
    t.model.user_id()
    t.model.email_template_id()
    t.model.user()
    t.model.email_template()
    t.model.created_at()
    t.model.updated_at()
  },
})
