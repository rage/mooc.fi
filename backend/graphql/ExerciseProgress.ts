import { objectType } from "@nexus/schema"

export const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})
