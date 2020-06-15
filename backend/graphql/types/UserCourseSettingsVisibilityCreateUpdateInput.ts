import { schema } from "nexus"

schema.inputObjectType({
  name: "user_course_settings_visibilityCreateInput",
  definition(t) {
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})

schema.inputObjectType({
  name: "user_course_settings_visibilityUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})
