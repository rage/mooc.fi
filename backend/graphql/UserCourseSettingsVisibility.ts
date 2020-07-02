import { schema } from "nexus"

schema.objectType({
  name: "UserCourseSettingsVisibility",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.language()
  },
})

schema.inputObjectType({
  name: "UserCourseSettingsVisibilityCreateInput",
  definition(t) {
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})

schema.inputObjectType({
  name: "UserCourseSettingsVisibilityUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})
