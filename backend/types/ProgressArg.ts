import { inputObjectType } from "nexus/dist"

const ProgressArg = inputObjectType({
  name: "ProgressArg",
  definition(t) {
    t.list.field("PointsByGroup", {
      type: "PointsByGroup",
    })
  },
})

export default ProgressArg
