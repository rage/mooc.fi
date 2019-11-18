import { inputObjectType } from "nexus/dist"

const CourseVariantCreateUpdateInput = inputObjectType({
  name: "CourseVariantCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})

export default CourseVariantCreateUpdateInput
