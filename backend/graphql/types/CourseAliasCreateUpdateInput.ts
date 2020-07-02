import { schema } from "nexus"

schema.inputObjectType({
  name: "CourseAliasCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

schema.inputObjectType({
  name: "CourseAliasUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})
