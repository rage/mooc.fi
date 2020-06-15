import { schema } from "nexus"

schema.inputObjectType({
  name: "course_variantCreateInput",
  definition(t) {
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

schema.inputObjectType({
  name: "course_variantUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})
