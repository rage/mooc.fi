import { inputObjectType } from "@nexus/schema"

export const CompletionArg = inputObjectType({
  name: "CompletionArg",
  definition(t) {
    t.string("completion_id", { required: true })
    t.string("student_number", { required: true })
    t.boolean("eligible_for_ects", { required: false })
  },
})

export const ManualCompletionArg = inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.string("user_id", { required: true })
    t.string("grade", { required: false })
    t.field("completion_date", { type: "DateTime", required: false })
  },
})
