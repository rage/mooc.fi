import { schema } from "nexus"

schema.inputObjectType({
  name: "course_aliasCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})
