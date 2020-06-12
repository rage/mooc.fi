import { schema } from "nexus"

schema.objectType({
  name: "UserCourseSettings",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.country()
    t.model.course({ alias: "course_id" })
    t.model.course_UserCourseSettingsTocourse({ alias: "course" })
    t.model.course_variant()
    t.model.language()
    t.model.marketing()
    t.model.other()
    t.model.research()
    t.model.user({ alias: "user_id" })
    t.model.user_UserCourseSettingsTouser({ alias: "user" })
  },
})
