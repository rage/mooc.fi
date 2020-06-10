import { inputObjectType } from "@nexus/schema"

const CompletionArg = inputObjectType({
  name: "CompletionArg",
  definition(t) {
    t.string("completion_id", { required: true })
    t.string("student_number", { required: true })
  },
})

export default CompletionArg
