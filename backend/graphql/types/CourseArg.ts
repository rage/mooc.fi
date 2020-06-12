import { schema } from "nexus"

schema.inputObjectType({
  name: "CourseArg",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("slug", { required: true })
    t.string("new_slug", { required: false })
    t.string("ects")
    t.id("photo", { required: false })
    t.field("new_photo", { type: "Upload", required: false })
    t.boolean("delete_photo", { required: false })
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "course_status" })
    t.string("teacher_in_charge_name", { required: true })
    t.string("teacher_in_charge_email", { required: true })
    t.string("support_email")
    t.string("start_date", { required: true })
    t.string("end_date")
    t.field("study_modules", {
      list: true,
      type: "study_moduleWhereUniqueInput",
    })
    t.field("course_translations", {
      list: true,
      type: "course_translationCreateUpdateInput",
      required: false,
    })
    t.field("open_university_registration_links", {
      list: true,
      type: "open_university_registration_linkCreateUpdateInput",
      required: false,
    })
    t.field("course_variants", {
      list: true,
      type: "course_variantCreateUpdateInput",
      required: false,
    })
    t.field("course_aliases", {
      list: true,
      type: "course_aliasCreateUpdateInput",
      required: false,
    })
    t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.id("completion_email", { required: false })
    t.id("inherit_settings_from", { required: false })
    t.id("completions_handled_by", { required: false })
    t.boolean("has_certificate", { required: false })
    t.field("user_course_settings_visibilities", {
      list: true,
      type: "user_course_settings_visibilityCreateUpdateInput",
      required: false,
    })
  },
})
