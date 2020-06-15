import { schema } from "nexus"

schema.inputObjectType({
  name: "course_aliasCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

schema.inputObjectType({
  name: "course_aliasUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})
