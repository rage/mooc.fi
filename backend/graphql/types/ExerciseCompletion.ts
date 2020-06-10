import { schema } from "nexus"

schema.objectType({
  name: "exercise_completion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.exercise()
    t.model.completed()
    t.model.n_points()
    t.model.timestamp()
    t.model.user()
  },
})
