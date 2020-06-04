import { inputObjectType } from "nexus/dist"

const CompletionArg = inputObjectType({
  name: "CompletionArg",
  definition(t) {
    t.string("completion_id", { required: true })
    t.string("student_number", { required: true })
    t.boolean("eligible_for_ects", { required: false })
  },
})

export default CompletionArg
