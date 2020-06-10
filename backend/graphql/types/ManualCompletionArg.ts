import { inputObjectType } from "@nexus/schema"

const ManualCompletionArg = inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.string("user_id", { required: true })
    t.string("grade", { required: false })
  },
})

export default ManualCompletionArg
