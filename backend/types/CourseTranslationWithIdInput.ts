import { inputObjectType } from "nexus/dist"

const CourseTranslationWithIdInput = inputObjectType({
  name: "CourseTranslationWithIdInput",
  definition(t) {
    t.id("id")
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: true })
    t.id("course")
  },
})

export default CourseTranslationWithIdInput
