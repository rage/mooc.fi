import { inputObjectType } from "nexus"

export const CompletionArg = inputObjectType({
  name: "CompletionArg",
  definition(t) {
    t.nonNull.string("completion_id")
    t.nonNull.string("student_number")
    t.nullable.boolean("eligible_for_ects")
    t.nullable.int("tier")
  },
})

export const ManualCompletionArg = inputObjectType({
  name: "ManualCompletionArg",
  definition(t) {
    t.nonNull.string("user_id")
    t.nullable.string("grade")
    t.nullable.field("completion_date", { type: "DateTime" })
    t.nullable.int("tier")
  },
})
