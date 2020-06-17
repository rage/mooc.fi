import { schema } from "nexus"

schema.inputObjectType({
  name: "CourseCreateArg",
  definition(t) {
    t.string("name")
    t.string("slug", { required: true })
    t.string("ects")
    t.id("photo", { required: false })
    t.field("new_photo", { type: "Upload", required: false })
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
    t.field("study_module", {
      list: true,
      type: "study_moduleWhereUniqueInput",
    })
    t.field("course_translation", {
      list: true,
      type: "course_translationCreateInput",
      required: false,
    })
    t.field("open_university_registration_link", {
      list: true,
      type: "open_university_registration_linkCreateInput",
      required: false,
    })
    t.field("course_variant", {
      list: true,
      type: "course_variantCreateInput",
      required: false,
    })
    t.field("course_alias", {
      list: true,
      type: "course_aliasCreateInput",
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
    t.field("user_course_settings_visibility", {
      list: true,
      type: "user_course_settings_visibilityCreateInput",
      required: false,
    })
  },
})

schema.inputObjectType({
  name: "CourseUpsertArg",
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
    t.field("study_module", {
      list: true,
      type: "study_moduleWhereUniqueInput",
    })
    t.field("course_translation", {
      list: true,
      type: "course_translationUpsertInput",
      required: false,
    })
    t.field("open_university_registration_link", {
      list: true,
      type: "open_university_registration_linkUpsertInput",
      required: false,
    })
    t.field("course_variant", {
      list: true,
      type: "course_variantUpsertInput",
      required: false,
    })
    t.field("course_alias", {
      list: true,
      type: "course_aliasUpsertInput",
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
    t.field("user_course_settings_visibility", {
      list: true,
      type: "user_course_settings_visibilityUpsertInput",
      required: false,
    })
  },
})
