import { inputObjectType } from "nexus"

export const CourseCreateArg = inputObjectType({
  name: "CourseCreateArg",
  definition(t) {
    t.string("name")
    t.nonNull.string("slug")
    t.string("ects")
    t.id("photo")
    t.field("new_photo", { type: "Upload" })
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "CourseStatus" })
    t.nonNull.string("teacher_in_charge_name")
    t.nonNull.string("teacher_in_charge_email")
    t.string("support_email")
    t.nonNull.string("start_date")
    t.string("end_date")
    t.list.nonNull.field("study_modules", {
      type: "StudyModuleWhereUniqueInput",
    })
    t.list.nonNull.field("course_translations", {
      type: "CourseTranslationCreateInput",
    })
    t.list.nonNull.field("open_university_registration_links", {
      type: "OpenUniversityRegistrationLinkCreateInput",
    })
    t.list.nonNull.field("course_variants", {
      type: "CourseVariantCreateInput",
    })
    t.list.nonNull.field("course_aliases", {
      type: "CourseAliasCreateInput",
    })
    t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.boolean("automatic_completions_eligible_for_ects")
    t.id("completion_email_id")
    t.id("inherit_settings_from")
    t.id("completions_handled_by")
    t.boolean("has_certificate")
    t.list.nonNull.field("user_course_settings_visibilities", {
      type: "UserCourseSettingsVisibilityCreateInput",
    })
    t.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.id("course_stats_email_id")
    t.list.nonNull.field("tags", {
      type: "TagCreateInput",
    })
  },
})

export const CourseUpsertArg = inputObjectType({
  name: "CourseUpsertArg",
  definition(t) {
    t.id("id")
    t.nonNull.string("name")
    t.nonNull.string("slug")
    t.string("new_slug")
    t.string("ects")
    t.id("photo")
    t.field("new_photo", { type: "Upload" })
    t.boolean("delete_photo")
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "CourseStatus" })
    t.nonNull.string("teacher_in_charge_name")
    t.nonNull.string("teacher_in_charge_email")
    t.string("support_email")
    t.nonNull.string("start_date")
    t.string("end_date")
    t.list.nonNull.field("study_modules", {
      type: "StudyModuleWhereUniqueInput",
    })
    t.list.nonNull.field("course_translations", {
      type: "CourseTranslationUpsertInput",
    })
    t.list.nonNull.field("open_university_registration_links", {
      type: "OpenUniversityRegistrationLinkUpsertInput",
    })
    t.list.nonNull.field("course_variants", {
      type: "CourseVariantUpsertInput",
    })
    t.list.nonNull.field("course_aliases", {
      type: "CourseAliasUpsertInput",
    })
    t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.boolean("automatic_completions_eligible_for_ects")
    t.id("completion_email_id")
    t.id("inherit_settings_from")
    t.id("completions_handled_by")
    t.boolean("has_certificate")
    t.list.nonNull.field("user_course_settings_visibilities", {
      type: "UserCourseSettingsVisibilityUpsertInput",
    })
    t.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.id("course_stats_email_id")
    t.list.nonNull.field("tags", {
      type: "TagUpsertInput",
    })
  },
})

export const CourseOrderByInput = inputObjectType({
  name: "CourseOrderByInput",
  definition(t) {
    t.field("id", { type: "SortOrder" })
    t.field("name", { type: "SortOrder" })
    t.field("slug", { type: "SortOrder" })
    t.field("ects", { type: "SortOrder" })
    t.field("start_date", { type: "SortOrder" })
    t.field("end_date", { type: "SortOrder" })
    t.field("order", { type: "SortOrder" })
    t.field("study_module_order", { type: "SortOrder" })
    t.field("points_needed", { type: "SortOrder" })
    t.field("exercise_completions_needed", { type: "SortOrder" })
    t.field("tier", { type: "SortOrder" })
    t.field("teacher_in_charge_name", { type: "SortOrder" })
    t.field("teacher_in_charge_email", { type: "SortOrder" })
    t.field("support_email", { type: "SortOrder" })
    t.field("created_at", { type: "SortOrder" })
    t.field("updated_at", { type: "SortOrder" })
  },
})
