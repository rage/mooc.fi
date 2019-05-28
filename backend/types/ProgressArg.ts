import { inputObjectType } from "nexus/dist"

const ProgressArg = inputObjectType({
  name: "ProgressArg",
  definition(t) {
    t.list.field("points_by_group", {
      type: "PointsByGroup",
    })
  },
})

export default ProgressArg
