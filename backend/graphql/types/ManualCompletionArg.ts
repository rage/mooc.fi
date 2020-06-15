import { schema } from "nexus"

schema.inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.string("user_id", { required: true })
    t.string("grade", { required: false })
  },
})
