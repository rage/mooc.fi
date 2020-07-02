import { schema } from "nexus"

schema.objectType({
  name: "ExerciseCompletionRequiredActions",
  definition(t) {
    t.model.id()
    t.model.exercise_completion_id()
    t.model.exercise_completion()
    t.model.value()
  },
})
