import { inputObjectType } from "@nexus/schema"

const CourseTranslationCreateUpdateInput = inputObjectType({
  name: "CourseTranslationCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})

export default CourseTranslationCreateUpdateInput
