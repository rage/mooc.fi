import { schema } from "nexus"

schema.inputObjectType({
  name: "open_university_registration_linkCreateInput",
  definition(t) {
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})

schema.inputObjectType({
  name: "open_university_registration_linkUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})
