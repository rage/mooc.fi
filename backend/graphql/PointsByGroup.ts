import { inputObjectType } from "nexus"

export const PointsByGroup = inputObjectType({
  name: "PointsByGroup",
  definition(t) {
    t.nonNull.string("group")
    t.nonNull.int("max_points")
    t.nonNull.int("n_points")
    t.nonNull.float("progress")
  },
})
