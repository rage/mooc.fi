import { schema } from "nexus"

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
