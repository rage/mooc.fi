import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE "completion" RENAME "course" TO "course_id";`)
  await knex.raw(`ALTER TABLE "completion" RENAME "user" to "user_id";`)
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "completion" TO "completion_id";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "course" TO "course_id";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "organization" TO "organization_id";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "user" TO "user_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "completion_email" TO "completion_email_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "completions_handled_by" TO "completions_handled_by_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "inherit_settings_from" TO "inherit_settings_from_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "owner_organization" TO "owner_organization_id";`,
  )
  await knex.raw(`ALTER TABLE "course" RENAME "photo" TO "photo_id";`)
  await knex.raw(`ALTER TABLE "course_alias" RENAME "course" TO "course_id";`)
  await knex.raw(
    `ALTER TABLE "course_organization" RENAME "course" TO "course_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" RENAME "organization" TO "organization_id";`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" RENAME "course" TO "course_id";`,
  )
  await knex.raw(`ALTER TABLE "course_variant" RENAME "course" TO "course_id";`)
  await knex.raw(
    `ALTER TABLE "email_delivery" RENAME "email_template" TO "email_template_id";`,
  )
  await knex.raw(`ALTER TABLE "email_delivery" RENAME "user" TO "user_id";`)
  await knex.raw(`ALTER TABLE "exercise" RENAME "course" TO "course_id";`)
  await knex.raw(`ALTER TABLE "exercise" RENAME "service" TO "service_id";`)
  await knex.raw(
    `ALTER TABLE "exercise_completion" RENAME "exercise" TO "exercise_id";`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" RENAME "user" to "user_id";`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion_required_actions" RENAME "exercise_completion" TO "exercise_completion_id";`,
  )
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" RENAME "course" TO "course_id";`,
  )
  await knex.raw(`ALTER TABLE "organization" RENAME "creator" TO "creator_id";`)
  await knex.raw(
    `ALTER TABLE "organization_translation" RENAME "organization" TO "organization_id";`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" RENAME "study_module" TO "study_module_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" RENAME "course" TO "course_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" RENAME "user" TO "user_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "course" TO "course_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "service" TO "service_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "user" TO "user_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "user_course_progress" TO "user_course_progress_id";`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" RENAME "course" TO "course_id";`,
  )
  await knex.raw(`ALTER TABLE "UserCourseSettings" RENAME "user" TO "user_id";`)
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" RENAME "course" TO "course_id";`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" RENAME "organization" TO "organization_id";`,
  )
  await knex.raw(`ALTER TABLE "user_organization" RENAME "user" TO "user_id";`)
  await knex.raw(
    `ALTER TABLE "verified_user" RENAME "organization" TO "organization_id";`,
  )
  await knex.raw(`ALTER TABLE "verified_user" RENAME "user" TO "user_id";`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE "completion" RENAME "course_id" TO "course";`)
  await knex.raw(`ALTER TABLE "completion" RENAME "user_id" TO "user";`)
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "completion_id" TO "completion";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "course_id" TO "course";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "organization_id" TO "organization";`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" RENAME "user_id" TO "user";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "completion_email_id" TO "completion_email";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "completions_handled_by_id" TO "completions_handled_by";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "inherit_settings_from_id" TO "inherit_settings_from";`,
  )
  await knex.raw(
    `ALTER TABLE "course" RENAME "owner_organization_id" TO "owner_organization";`,
  )
  await knex.raw(`ALTER TABLE "course" RENAME "photo_id" TO "photo";`)
  await knex.raw(`ALTER TABLE "course_alias" RENAME "course_id" TO "course";`)
  await knex.raw(
    `ALTER TABLE "course_organization" RENAME "course_id" TO "course";`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" RENAME "organization_id" TO "organization";`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" RENAME "course_id" TO "course";`,
  )
  await knex.raw(`ALTER TABLE "course_variant" RENAME "course_id" TO "course";`)
  await knex.raw(
    `ALTER TABLE "email_delivery" RENAME "email_template_id" TO "email_template";`,
  )
  await knex.raw(`ALTER TABLE "email_delivery" RENAME "user_id" TO "user";`)
  await knex.raw(`ALTER TABLE "exercise" RENAME "course_id" TO "course";`)
  await knex.raw(`ALTER TABLE "exercise" RENAME "service_id" TO "service";`)
  await knex.raw(
    `ALTER TABLE "exercise_completion" RENAME "exercise_id" TO "exercise";`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" RENAME "user_id" TO "user";`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion_required_actions" RENAME "exercise_completion_id" TO "exercise_completion";`,
  )
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" RENAME "course_id" TO "course";`,
  )
  await knex.raw(`ALTER TABLE "organization" RENAME "creator_id" TO "creator";`)
  await knex.raw(
    `ALTER TABLE "organization_translation" RENAME "organization_id" TO "organization";`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" RENAME "study_module_id" TO "study_module";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" RENAME "course_id" TO "course";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" RENAME "user_id" TO "user";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "course_id" TO "course";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "service_id" TO "service";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "user_id" TO "user";`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" RENAME "user_course_progress_id" TO "user_course_progress";`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" RENAME "course_id" TO "course";`,
  )
  await knex.raw(`ALTER TABLE "UserCourseSettings" RENAME "user_id" TO "user";`)
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" RENAME "course_id" TO "course";`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" RENAME "organization_id" TO "organization";`,
  )
  await knex.raw(`ALTER TABLE "user_organization" RENAME "user_id" TO "user";`)
  await knex.raw(
    `ALTER TABLE "verified_user" RENAME "organization_id" TO "organization";`,
  )
  await knex.raw(`ALTER TABLE "verified_user" RENAME "user_id" TO "user";`)
}
