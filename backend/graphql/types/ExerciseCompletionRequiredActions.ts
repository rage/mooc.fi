import { schema } from "nexus"

schema.objectType({
  name: "exercise_completion_required_actions",
  definition(t) {
    t.model.id()
    t.model.exercise_completion({ alias: "exercise_completion_id" })
    t.model.exercise_completion_exercise_completionToexercise_completion_required_actions(
      { alias: "exercise_completion" },
    )
    t.model.value()
  },
})
