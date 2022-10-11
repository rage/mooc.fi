import { inputObjectType, nonNull } from "nexus"

export const CourseCreateArg = inputObjectType({
  name: "CourseCreateArg",
  definition(t) {
    t.string("name")
    t.nonNull.string("slug")
    t.string("ects")
    t.nullable.id("photo")
    t.nullable.field("new_photo", { type: "Upload" })
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
    t.list.field("study_modules", {
      type: nonNull("StudyModuleWhereUniqueInput"),
    })
    t.list.nullable.field("course_translations", {
      type: nonNull("CourseTranslationCreateInput"),
    })
    t.list.nullable.field("open_university_registration_links", {
      type: nonNull("OpenUniversityRegistrationLinkCreateInput"),
    })
    t.list.nullable.field("course_variants", {
      type: nonNull("CourseVariantCreateInput"),
    })
    t.list.nullable.field("course_aliases", {
      type: nonNull("CourseAliasCreateInput"),
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
      type: nonNull("UserCourseSettingsVisibilityCreateInput"),
    })
    t.nullable.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.nullable.id("course_stats_email_id")
    t.list.nullable.field("course_tags", {
      type: nonNull("CourseTagCreateOrUpsertWithoutCourseIdInput"),
    })
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
    t.nullable.field("new_photo", { type: "Upload" })
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
    t.nonNull.string("start_date")
    t.string("end_date")
    t.list.field("study_modules", {
      type: nonNull("StudyModuleWhereUniqueInput"),
    })
    t.list.nullable.field("course_translations", {
      type: nonNull("CourseTranslationUpsertInput"),
    })
    t.list.nullable.field("open_university_registration_links", {
      type: nonNull("OpenUniversityRegistrationLinkUpsertInput"),
    })
    t.list.nullable.field("course_variants", {
      type: nonNull("CourseVariantUpsertInput"),
    })
    t.list.nullable.field("course_aliases", {
      type: nonNull("CourseAliasUpsertInput"),
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
      type: nonNull("UserCourseSettingsVisibilityUpsertInput"),
    })
    t.nullable.boolean("upcoming_active_link")
    t.int("tier")
    t.int("exercise_completions_needed")
    t.int("points_needed")
    t.nullable.id("course_stats_email_id")
    t.list.nullable.field("course_tags", {
      type: nonNull("CourseTagCreateOrUpsertWithoutCourseIdInput"),
    })
  },
})
