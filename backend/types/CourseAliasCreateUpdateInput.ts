import { inputObjectType } from "@nexus/schema"

const CourseAliasCreateUpdateInput = inputObjectType({
  name: "CourseAliasCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})

export default CourseAliasCreateUpdateInput
