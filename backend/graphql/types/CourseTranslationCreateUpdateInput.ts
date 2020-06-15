import { schema } from "nexus"

schema.inputObjectType({
  name: "course_translationCreateInput",
  definition(t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})

schema.inputObjectType({
  name: "course_translationUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})
