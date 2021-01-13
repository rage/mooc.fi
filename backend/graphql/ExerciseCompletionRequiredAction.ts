import { objectType } from "nexus"

export const ExerciseCompletionRequiredAction = objectType({
  name: "ExerciseCompletionRequiredAction",
  definition(t) {
    t.model.id()
    t.model.exercise_completion_id()
    t.model.exercise_completion()
    t.model.value()
  },
})
