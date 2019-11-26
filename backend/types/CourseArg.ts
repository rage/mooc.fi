import { inputObjectType } from "nexus/dist"

const CourseArg = inputObjectType({
  name: "CourseArg",
  definition(t) {
    t.id("id", { required: false })
    t.string("name")
    t.string("slug")
    t.string("new_slug", { required: false })
    t.string("ects")
    t.id("photo", { required: false })
    t.field("new_photo", { type: "Upload", required: false })
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "CourseStatus" })
    t.field("study_modules", {
      list: true,
      type: "StudyModuleWhereUniqueInput",
    })
    t.field("course_translations", {
      list: true,
      type: "CourseTranslationCreateUpdateInput",
      required: false,
    })
    t.field("open_university_registration_links", {
      list: true,
      type: "OpenUniversityRegistrationLinkCreateUpdateInput",
      required: false,
    })
    t.field("course_variants", {
      list: true,
      type: "CourseVariantCreateUpdateInput",
      required: false,
    }),
      t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.id("completion_email")
  },
})

export default CourseArg
