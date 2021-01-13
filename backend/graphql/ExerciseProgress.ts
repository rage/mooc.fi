import { objectType } from "nexus"

export const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})
