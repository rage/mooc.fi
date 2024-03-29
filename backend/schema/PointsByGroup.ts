import { inputObjectType, objectType } from "nexus"

export const PointsByGroup = objectType({
  name: "PointsByGroup",
  definition(t) {
    t.nonNull.string("group")
    t.nonNull.float("max_points")
    t.nonNull.float("n_points")
    t.nonNull.float("progress")
  },
})

export const PointsByGroupInput = inputObjectType({
  name: "PointsByGroupInput",
  definition(t) {
    t.nonNull.string("group")
    t.nonNull.float("max_points")
    t.nonNull.float("n_points")
    t.nonNull.float("progress")
  },
})
