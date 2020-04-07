import { objectType } from "nexus/dist"

const ExerciseProgress = objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})

export default ExerciseProgress
