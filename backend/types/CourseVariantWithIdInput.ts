import { inputObjectType } from "nexus/dist"

const CourseVariantWithIdInput = inputObjectType({
  name: "CourseVariantWithIdInput",
  definition(t) {
    t.id("id")
    t.string("slug", { required: true })
    t.string("description")
    t.id("course")
  },
})

export default CourseVariantWithIdInput
