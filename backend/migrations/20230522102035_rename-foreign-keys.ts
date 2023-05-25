import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "ab_enrollment"
      RENAME CONSTRAINT "ab_enrollment_ab_study" TO "ab_enrollment_ab_study_id_fkey";
    ALTER TABLE "ab_enrollment"
      RENAME CONSTRAINT "ab_enrollment_user" TO "ab_enrollment_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "completion"
      RENAME CONSTRAINT "completion_course_fkey" TO "completion_course_id_fkey";
    ALTER TABLE "completion"
      RENAME CONSTRAINT "completion_user_fkey" TO "completion_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "completion_registered"
      RENAME CONSTRAINT "completion_registered_completion_fkey" TO "completion_registered_completion_id_fkey";
    ALTER TABLE "completion_registered"
      RENAME CONSTRAINT "completion_registered_user_fkey" TO "completion_registered_user_id_fkey";
    ALTER TABLE "completion_registered"
      RENAME CONSTRAINT "completion_registered_course_fkey" TO "completion_registered_course_id_fkey";
    ALTER TABLE "completion_registered"
      RENAME CONSTRAINT "completion_registered_organization_fkey" TO "completion_registered_organization_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course"
      RENAME CONSTRAINT "course_completion_email_fkey" TO "course_completion_email_id_fkey";
    ALTER TABLE "course"
      RENAME CONSTRAINT "course_completions_handled_by_fkey" TO "course_completions_handled_by_id_fkey";
    ALTER TABLE "course"
      RENAME CONSTRAINT "course_inherit_settings_from_fkey" TO "course_inherit_settings_from_id_fkey";
    ALTER TABLE "course"
      RENAME CONSTRAINT "course_owner_organization_fkey" TO "course_owner_organization_id_fkey";
    ALTER TABLE "course"
      RENAME CONSTRAINT "course_photo_fkey" TO "course_photo_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_alias"
      RENAME CONSTRAINT "course_alias_course_fkey" TO "course_alias_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_organization"
      RENAME CONSTRAINT "course_organization_course_fkey" TO "course_organization_course_id_fkey";
    ALTER TABLE "course_organization"
      RENAME CONSTRAINT "course_organization_organization_fkey" TO "course_organization_organization_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_translation"
      RENAME CONSTRAINT "course_translation_course_fkey" TO "course_translation_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_variant"
      RENAME CONSTRAINT "course_variant_course_fkey" TO "course_variant_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "email_delivery"
      RENAME CONSTRAINT "email_delivery_email_template_fkey" TO "email_delivery_email_template_id_fkey";
    ALTER TABLE "email_delivery"
      RENAME CONSTRAINT "email_delivery_user_fkey" TO "email_delivery_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "email_template"
      RENAME CONSTRAINT "course_threshold_email_fkey" TO "email_template_triggered_automatically_by_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "exercise"
      RENAME CONSTRAINT "exercise_course_fkey" TO "exercise_course_id_fkey";
    ALTER TABLE "exercise"
      RENAME CONSTRAINT "exercise_service_fkey" TO "exercise_service_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "exercise_completion"
      RENAME CONSTRAINT "exercise_completion_exercise_fkey" TO "exercise_completion_exercise_id_fkey";
    ALTER TABLE "exercise_completion"
      RENAME CONSTRAINT "exercise_completion_user_fkey" TO "exercise_completion_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "exercise_completion_required_actions"
      RENAME CONSTRAINT "exercise_completion_required_actions_ExerciseCompletion_fkey" TO "exercise_completion_required_actions_exercise_completion_i_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "open_university_registration_link"
      RENAME CONSTRAINT "open_university_registration_link_course_fkey" TO "open_university_registration_link_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      RENAME CONSTRAINT "organization_creator_fkey" TO "organization_creator_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "organization_translation"
      RENAME CONSTRAINT "organization_translation_organization_fkey" TO "organization_translation_organization_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "stored_data"
      RENAME CONSTRAINT "stored_data" TO "stored_data_user_id_fkey";
    ALTER TABLE "stored_data"
      RENAME CONSTRAINT "stored_data_course" TO "stored_data_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "study_module_translation"
      RENAME CONSTRAINT "study_module_translation_study_module_fkey" TO "study_module_translation_study_module_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "user_course_progress"
      RENAME CONSTRAINT "user_course_progress_course_fkey" TO "user_course_progress_course_id_fkey";
    ALTER TABLE "user_course_progress"
      RENAME CONSTRAINT "user_course_progress_user_fkey" TO "user_course_progress_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "user_course_service_progress"
      RENAME CONSTRAINT "user_course_service_progress_course_fkey" TO "user_course_service_progress_course_id_fkey";
    ALTER TABLE "user_course_service_progress"
      RENAME CONSTRAINT "user_course_service_progress_user_fkey" TO "user_course_service_progress_user_id_fkey";
    ALTER TABLE "user_course_service_progress"
      RENAME CONSTRAINT "user_course_service_progress_service_fkey" TO "user_course_service_progress_service_id_fkey";
    ALTER TABLE "user_course_service_progress"
      RENAME CONSTRAINT "user_course_service_progress_user_course_progress_fkey" TO "user_course_service_progress_user_course_progress_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "user_course_setting"
      RENAME CONSTRAINT "UserCourseSettings_course_fkey" TO "user_course_setting_course_id_fkey";
    ALTER TABLE "user_course_setting"
      RENAME CONSTRAINT "UserCourseSettings_user_fkey" TO "user_course_setting_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "user_course_settings_visibility"
      RENAME CONSTRAINT "user_course_settings_visibility_course_fkey" TO "user_course_settings_visibility_course_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "user_organization"
      RENAME CONSTRAINT "user_organization_organization_fkey" TO "user_organization_organization_id_fkey";
    ALTER TABLE "user_organization"
      RENAME CONSTRAINT "user_organization_user_fkey" TO "user_organization_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      RENAME CONSTRAINT "verified_user_user_fkey" TO "verified_user_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_ownership"
      RENAME CONSTRAINT "course_ownership_course" TO "course_ownership_course_id_fkey";
    ALTER TABLE "course_ownership"
      RENAME CONSTRAINT "course_ownership_user" TO "course_ownership_user_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_subscription"
      RENAME CONSTRAINT "course_stats_subscription_user" TO "course_stats_subscription_user_id_fkey";
    ALTER TABLE "course_stats_subscription"
      RENAME CONSTRAINT "course_stats_subscription_email_template" TO "course_stats_subscription_email_template_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      RENAME CONSTRAINT "tag_translation_tag_fkey" TO "tag_translation_tag_id_fkey";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER TABLE "ab_enrollment"
    RENAME CONSTRAINT "ab_enrollment_ab_study_id_fkey" TO "ab_enrollment_ab_study";
  ALTER TABLE "ab_enrollment"
    RENAME CONSTRAINT "ab_enrollment_user_id_fkey" TO "ab_enrollment_user";
`)

  await knex.raw(`
  ALTER TABLE "completion"
    RENAME CONSTRAINT "completion_course_id_fkey" TO "completion_course_fkey";
  ALTER TABLE "completion"
    RENAME CONSTRAINT "completion_user_id_fkey" TO "completion_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "completion_registered"
    RENAME CONSTRAINT "completion_registered_completion_id_fkey" TO "completion_registered_completion_fkey";
  ALTER TABLE "completion_registered"
    RENAME CONSTRAINT "completion_registered_user_id_fkey" TO "completion_registered_user_fkey";
  ALTER TABLE "completion_registered"
    RENAME CONSTRAINT "completion_registered_course_id_fkey" TO "completion_registered_course_fkey";
  ALTER TABLE "completion_registered"
    RENAME CONSTRAINT "completion_registered_organization_id_fkey" TO "completion_registered_organization_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course"
    RENAME CONSTRAINT "course_completion_email_id_fkey" TO "course_completion_email_fkey";
  ALTER TABLE "course"
    RENAME CONSTRAINT "course_completions_handled_by_id_fkey" TO "course_completions_handled_by_fkey";
  ALTER TABLE "course"
    RENAME CONSTRAINT "course_inherit_settings_from_id_fkey" TO "course_inherit_settings_from_fkey";
  ALTER TABLE "course"
    RENAME CONSTRAINT "course_owner_organization_id_fkey" TO "course_owner_organization_fkey";
  ALTER TABLE "course"
    RENAME CONSTRAINT "course_photo_id_fkey" TO "course_photo_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course_alias"
    RENAME CONSTRAINT "course_alias_course_id_fkey" TO "course_alias_course_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course_organization"
    RENAME CONSTRAINT "course_organization_course_id_fkey" TO "course_organization_course_fkey";
  ALTER TABLE "course_organization"
    RENAME CONSTRAINT "course_organization_organization_id_fkey" TO "course_organization_organization_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course_translation"
    RENAME CONSTRAINT "course_translation_course_id_fkey" TO "course_translation_course_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course_variant"
    RENAME CONSTRAINT "course_variant_course_id_fkey" TO "course_variant_course_fkey";
`)

  await knex.raw(`
  ALTER TABLE "email_delivery"
    RENAME CONSTRAINT "email_delivery_email_template_id_fkey" TO "email_delivery_email_template_fkey";
  ALTER TABLE "email_delivery"
    RENAME CONSTRAINT "email_delivery_user_id_fkey" TO "email_delivery_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "email_template"
    RENAME CONSTRAINT "email_template_triggered_automatically_by_course_id_fkey" TO "course_threshold_email_fkey";
`)

  await knex.raw(`
  ALTER TABLE "exercise"
    RENAME CONSTRAINT "exercise_course_id_fkey" TO "exercise_course_fkey";
  ALTER TABLE "exercise"
    RENAME CONSTRAINT "exercise_service_id_fkey" TO "exercise_service_fkey";
`)

  await knex.raw(`
  ALTER TABLE "exercise_completion"
    RENAME CONSTRAINT "exercise_completion_exercise_id_fkey" TO "exercise_completion_exercise_fkey";
  ALTER TABLE "exercise_completion"
    RENAME CONSTRAINT "exercise_completion_user_id_fkey" TO "exercise_completion_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "exercise_completion_required_actions"
    RENAME CONSTRAINT "exercise_completion_required_actions_exercise_completion_i_fkey" 
    TO "exercise_completion_required_actions_ExerciseCompletion_fkey";
`)

  await knex.raw(`
  ALTER TABLE "open_university_registration_link"
    RENAME CONSTRAINT "open_university_registration_link_course_id_fkey" TO "open_university_registration_link_course_fkey";
`)

  await knex.raw(`
  ALTER TABLE "organization"
    RENAME CONSTRAINT "organization_creator_id_fkey" TO "organization_creator_fkey";
`)

  await knex.raw(`
  ALTER TABLE "organization_translation"
    RENAME CONSTRAINT "organization_translation_organization_id_fkey" TO "organization_translation_organization_fkey";
`)

  await knex.raw(`
  ALTER TABLE "stored_data"
    RENAME CONSTRAINT "stored_data_user_id_fkey" TO "stored_data";
  ALTER TABLE "stored_data"
    RENAME CONSTRAINT "stored_data_course_id_fkey" TO "stored_data_course";
`)

  await knex.raw(`
  ALTER TABLE "study_module_translation"
    RENAME CONSTRAINT "study_module_translation_study_module_id_fkey" TO "study_module_translation_study_module_fkey";
`)

  await knex.raw(`
  ALTER TABLE "user_course_progress"
    RENAME CONSTRAINT "user_course_progress_course_id_fkey" TO "user_course_progress_course_fkey";
  ALTER TABLE "user_course_progress"
    RENAME CONSTRAINT "user_course_progress_user_id_fkey" TO "user_course_progress_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "user_course_service_progress"
    RENAME CONSTRAINT "user_course_service_progress_course_id_fkey" TO "user_course_service_progress_course_fkey";
  ALTER TABLE "user_course_service_progress"
    RENAME CONSTRAINT "user_course_service_progress_user_id_fkey" TO "user_course_service_progress_user_fkey";
  ALTER TABLE "user_course_service_progress"
    RENAME CONSTRAINT "user_course_service_progress_service_id_fkey" TO "user_course_service_progress_service_fkey";
  ALTER TABLE "user_course_service_progress"
    RENAME CONSTRAINT "user_course_service_progress_user_course_progress_id_fkey" TO "user_course_service_progress_user_course_progress_fkey";
`)

  await knex.raw(`
  ALTER TABLE "user_course_setting"
    RENAME CONSTRAINT "user_course_setting_course_id_fkey" TO "UserCourseSettings_course_fkey";
  ALTER TABLE "user_course_setting"
    RENAME CONSTRAINT "user_course_setting_user_id_fkey" TO "UserCourseSettings_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "user_course_settings_visibility"
    RENAME CONSTRAINT "user_course_settings_visibility_course_id_fkey" TO "user_course_settings_visibility_course_fkey";
`)

  await knex.raw(`
  ALTER TABLE "user_organization"
    RENAME CONSTRAINT "user_organization_organization_id_fkey" TO "user_organization_organization_fkey";
  ALTER TABLE "user_organization"
    RENAME CONSTRAINT "user_organization_user_id_fkey" TO "user_organization_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "verified_user"
    RENAME CONSTRAINT "verified_user_user_id_fkey" TO "verified_user_user_fkey";
`)

  await knex.raw(`
  ALTER TABLE "course_ownership"
    RENAME CONSTRAINT "course_ownership_course_id_fkey" TO "course_ownership_course";
  ALTER TABLE "course_ownership"
    RENAME CONSTRAINT "course_ownership_user_id_fkey" TO "course_ownership_user";
`)

  await knex.raw(`
  ALTER TABLE "course_stats_subscription"
    RENAME CONSTRAINT "course_stats_subscription_user_id_fkey" TO "course_stats_subscription_user";
  ALTER TABLE "course_stats_subscription"
    RENAME CONSTRAINT "course_stats_subscription_email_template_id_fkey" TO "course_stats_subscription_email_template";
`)

  await knex.raw(`
  ALTER TABLE "tag_translation"
    RENAME CONSTRAINT "tag_translation_tag_id_fkey" TO "tag_translation_tag_fkey";
`)
}
