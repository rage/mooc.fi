import { inputObjectType } from "nexus"

export const CourseCreateArg = inputObjectType({
  name: "CourseCreateArg",
  definition(t) {
    t.string("name")
    t.nonNull.string("slug")
    t.string("ects")
    t.nullable.id("photo")
    t.nullable.upload("new_photo")
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "CourseStatus" })
    t.nonNull.string("teacher_in_charge_name")
    t.nonNull.string("teacher_in_charge_email")
    t.string("support_email")
    t.nonNull.datetime("start_date")
    t.datetime("end_date")
    t.list.field("study_modules", {
      type: "StudyModuleWhereUniqueInput",
    })
    t.list.nullable.field("course_translations", {
      type: "CourseTranslationCreateInput",
    })
    t.list.nullable.field("open_university_registration_links", {
      type: "OpenUniversityRegistrationLinkCreateInput",
    })
    t.list.nullable.field("course_variants", {
      type: "CourseVariantCreateInput",
    })
    t.list.nullable.field("course_aliases", {
      type: "CourseAliasCreateInput",
    })
    t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.boolean("automatic_completions_eligible_for_ects")
    t.nullable.id("completion_email_id")
    t.nullable.id("inherit_settings_from")
    t.nullable.id("completions_handled_by")
    t.nullable.boolean("has_certificate")
    t.list.nullable.field("user_course_settings_visibilities", {
      type: "UserCourseSettingsVisibilityCreateInput",
    })
    t.nullable.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.nullable.id("course_stats_email_id")
  },
})

export const CourseUpsertArg = inputObjectType({
  name: "CourseUpsertArg",
  definition(t) {
    t.nullable.id("id")
    t.nonNull.string("name")
    t.nonNull.string("slug")
    t.nullable.string("new_slug")
    t.string("ects")
    t.nullable.id("photo")
    t.nullable.upload("new_photo")
    t.nullable.boolean("delete_photo")
    t.boolean("base64")
    t.boolean("start_point")
    t.boolean("promote")
    t.boolean("hidden")
    t.boolean("study_module_start_point")
    t.field("status", { type: "CourseStatus" })
    t.nonNull.string("teacher_in_charge_name")
    t.nonNull.string("teacher_in_charge_email")
    t.string("support_email")
    t.nonNull.datetime("start_date")
    t.datetime("end_date")
    t.list.field("study_modules", {
      type: "StudyModuleWhereUniqueInput",
    })
    t.list.nullable.field("course_translations", {
      type: "CourseTranslationUpsertInput",
    })
    t.list.nullable.field("open_university_registration_links", {
      type: "OpenUniversityRegistrationLinkUpsertInput",
    })
    t.list.nullable.field("course_variants", {
      type: "CourseVariantUpsertInput",
    })
    t.list.nullable.field("course_aliases", {
      type: "CourseAliasUpsertInput",
    })
    t.int("order")
    t.int("study_module_order")
    t.int("points_needed")
    t.boolean("automatic_completions")
    t.boolean("automatic_completions_eligible_for_ects")
    t.nullable.id("completion_email_id")
    t.nullable.id("inherit_settings_from")
    t.nullable.id("completions_handled_by")
    t.nullable.boolean("has_certificate")
    t.list.nullable.field("user_course_settings_visibilities", {
      type: "UserCourseSettingsVisibilityUpsertInput",
    })
    t.nullable.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.nullable.id("course_stats_email_id")
  },
})
