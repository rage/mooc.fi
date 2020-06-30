import { schema } from "nexus"

schema.objectType({
  name: "exercise_completion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.exercise({ alias: "exercise_id" })
    t.model.exercise_exerciseToexercise_completion({ alias: "exercise" })
    t.model.completed()
    t.model.n_points()
    t.model.timestamp()
    t.model.user({ alias: "user_id" })
    t.model.user_exercise_completionTouser({ alias: "user" })
    t.model.exercise_completion_required_actions()
  },
})
