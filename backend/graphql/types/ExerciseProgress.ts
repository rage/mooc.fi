import { schema } from "nexus"

schema.objectType({
  name: "exercise_progress",
  definition(t) {
    t.float("total")
    t.float("exercises")
  },
})
