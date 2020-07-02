import { schema } from "nexus"

schema.inputObjectType({
  name: "CourseVariantCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

schema.inputObjectType({
  name: "CourseVariantUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})
