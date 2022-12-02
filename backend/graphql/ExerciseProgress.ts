import { objectType } from "nexus"

export const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
    t.int("exercise_count")
    t.int("exercises_completed_count")
  },
})
