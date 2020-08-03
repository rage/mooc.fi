import { inputObjectType } from "nexus/dist"

const ManualCompletionArg = inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.string("user_id", { required: true })
    t.string("grade", { required: false })
    t.field("completion_date", { type: "DateTime", required: false })
  },
})

export default ManualCompletionArg
