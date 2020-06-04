import { objectType } from "@nexus/schema"

const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})

export default ExerciseProgress
