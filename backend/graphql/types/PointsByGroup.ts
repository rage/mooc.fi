import { schema } from "nexus"

schema.inputObjectType({
  name: "PointsByGroup",
  definition(t) {
    t.string("group", { required: true })
    t.int("max_points", { required: true })
    t.int("n_points", { required: true })
    t.float("progress", { required: true })
  },
})
