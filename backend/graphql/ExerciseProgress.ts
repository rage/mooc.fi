import { schema } from "nexus"

schema.objectType({
  name: "ExerciseProgress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})
