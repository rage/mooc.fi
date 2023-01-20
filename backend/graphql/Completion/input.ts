import { inputObjectType } from "nexus"

export const CompletionArg = inputObjectType({
  name: "CompletionArg",
  definition(t) {
    t.nonNull.string("completion_id")
    t.nonNull.string("student_number")
    t.boolean("eligible_for_ects")
    t.int("tier")
  },
})

export const ManualCompletionArg = inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.nonNull.string("user_id")
    t.string("grade")
    t.field("completion_date", { type: "DateTime" })
    t.int("tier")
  },
})
