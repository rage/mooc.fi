import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER INDEX "ab_enrollment.ab_study_id_index" 
      RENAME TO "ab_enrollment_ab_study_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "completion.completion_language_index" 
      RENAME TO "completion_completion_language_idx";
    ALTER INDEX "completion.course_id_user_id_ordered_index"
      RENAME TO "completion_course_id_user_id_created_at_idx";
    ALTER INDEX "completion.user_id_course_id_ordered_index"
      RENAME TO "completion_user_id_course_id_created_at_idx";
  `)
  await knex.raw(`
    ALTER INDEX "completion_registered.completion_id_index"
      RENAME TO "completion_registered_completion_id_idx";
    ALTER INDEX "completion_registered.course_id_index"
      RENAME TO "completion_registered_course_id_idx";
    ALTER INDEX "completion_registered.organization_id_index"
      RENAME TO "completion_registered_organization_id_idx";
    ALTER INDEX "completion_registered.user_id_course_id_index"
      RENAME TO "completion_registered_user_id_course_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "course.completion_email_id_index"
      RENAME TO "course_completion_email_id_idx";
    ALTER INDEX "course.completions_handled_by_index"
      RENAME TO "course_completions_handled_by_id_idx";
    ALTER INDEX "course.status_index"
      RENAME TO "course_status_idx";
  `)
  await knex.raw(`
    ALTER INDEX "course_alias.course_id"
      RENAME TO "course_alias_course_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "course_translation.course_id_language_index"
      RENAME TO "course_translation_course_id_language_idx";
    ALTER INDEX "course_translation.name_index"
      RENAME TO "course_translation_name_idx";
  `)
  await knex.raw(`
    ALTER INDEX "course_variant.course_id"
      RENAME TO "course_variant_course_id_idx";
    ALTER INDEX "course_variant.slug"
      RENAME TO "course_variant_slug_idx";
  `)
  await knex.raw(`
    ALTER INDEX "email_delivery.email_template_id_index"
      RENAME TO "email_delivery_email_template_id_idx";
    ALTER INDEX "email_delivery.user_id_email_template_id"
      RENAME TO "email_delivery_user_id_email_template_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "email_template.triggered_automatically_template_type_index"
      RENAME TO "email_template_triggered_automatically_by_course_id_templat_idx";
  `)
  await knex.raw(`
    ALTER INDEX "exercise.course_id_service_id_custom_id_index"
      RENAME TO "exercise_course_id_service_id_custom_id_idx";
    ALTER INDEX "exercise.custom_id_index"
      RENAME TO "exercise_custom_id_idx";
    ALTER INDEX "exercise.service_id_index"
      RENAME TO "exercise_service_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "exercise_completion.user_id_exercise_id_ordered_index"
      RENAME TO "exercise_completion_user_id_exercise_id_timestamp_updated_a_idx";
  `)
  await knex.raw(`
    ALTER INDEX "open_university_registration_link.course_id_index"
      RENAME TO "open_university_registration_link_course_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "organization.creator_id_index"
      RENAME TO "organization_creator_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "organization_translation.organization_id_index"
      RENAME TO "organization_translation_organization_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "stored_data.user_id_index"
      RENAME TO "stored_data_user_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "study_module_translation.study_module_id_language_index"
      RENAME TO "study_module_translation_study_module_id_language_idx";
  `)
  await knex.raw(`
    ALTER INDEX "user.trgm_email_index"
      RENAME TO "user_email_idx";
    ALTER INDEX "user.trgm_first_name_last_name_index"
      RENAME TO "user_first_name_last_name_idx";
    ALTER INDEX "user.trgm_last_name_index"
      RENAME TO "user_last_name_idx";
  `)
  await knex.raw(`
    ALTER INDEX "user_course_progress.course_id_user_id"
      RENAME TO "user_course_progress_course_id_user_id_idx";
    ALTER INDEX "user_course_progress.user_id_index"
      RENAME TO "user_course_progress_user_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "user_course_service_progress.course_id_index"
      RENAME TO "user_course_service_progress_course_id_idx";
    ALTER INDEX "user_course_service_progress.service_id_course_id_user_id"
      RENAME TO "user_course_service_progress_service_id_course_id_user_id_idx";
    ALTER INDEX "user_course_service_progress.user_id_index"
      RENAME TO "user_course_service_progress_user_id_idx";
  `)
  await knex.raw(`
    ALTER INDEX "user_course_setting.country_index"
      RENAME TO "user_course_setting_country_idx";
    ALTER INDEX "user_course_setting.course_user_ordered_index"
      RENAME TO "user_course_setting_course_id_user_id_created_at_idx";
    ALTER INDEX "user_course_setting.language_index"
      RENAME TO "user_course_setting_language_idx";
    ALTER INDEX "user_course_setting.user_id"
      RENAME TO "user_course_setting_user_id_idx";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER INDEX "ab_enrollment_ab_study_id_idx" 
    RENAME TO "ab_enrollment.ab_study_id_index";
`)

  await knex.raw(`
  ALTER INDEX "completion_completion_language_idx" 
    RENAME TO "completion.completion_language_index";
  ALTER INDEX "completion_course_id_user_id_created_at_idx"
    RENAME TO "completion.course_id_user_id_ordered_index";
  ALTER INDEX "completion_user_id_course_id_created_at_idx"
    RENAME TO "completion.user_id_course_id_ordered_index";
`)

  await knex.raw(`
  ALTER INDEX "completion_registered_completion_id_idx"
    RENAME TO "completion_registered.completion_id_index";
  ALTER INDEX "completion_registered_course_id_idx"
    RENAME TO "completion_registered.course_id_index";
  ALTER INDEX "completion_registered_organization_id_idx"
    RENAME TO "completion_registered.organization_id_index";
  ALTER INDEX "completion_registered_user_id_course_id_idx"
    RENAME TO "completion_registered.user_id_course_id_index";
`)

  await knex.raw(`
  ALTER INDEX "course_completion_email_id_idx"
    RENAME TO "course.completion_email_id_index";
  ALTER INDEX "course_completions_handled_by_id_idx"
    RENAME TO "course.completions_handled_by_index";
  ALTER INDEX "course_status_idx"
    RENAME TO "course.status_index";
`)

  await knex.raw(`
  ALTER INDEX "course_alias_course_id_idx"
    RENAME TO "course_alias.course_id";
`)

  await knex.raw(`
  ALTER INDEX "course_translation_course_id_language_idx"
    RENAME TO "course_translation.course_id_language_index";
  ALTER INDEX "course_translation_name_idx"
    RENAME TO "course_translation.name_index";
`)

  await knex.raw(`
  ALTER INDEX "course_variant_course_id_idx"
    RENAME TO "course_variant.course_id";
  ALTER INDEX "course_variant_slug_idx"
    RENAME TO "course_variant.slug";
`)

  await knex.raw(`
  ALTER INDEX "email_delivery_email_template_id_idx"
    RENAME TO "email_delivery.email_template_id_index";
  ALTER INDEX "email_delivery_user_id_email_template_id_idx"
    RENAME TO "email_delivery.user_id_email_template_id";
`)

  await knex.raw(`
  ALTER INDEX "email_template_triggered_automatically_by_course_id_templat_idx"
    RENAME TO "email_template.triggered_automatically_template_type_index";
`)

  await knex.raw(`
  ALTER INDEX "exercise_course_id_service_id_custom_id_idx"
    RENAME TO "exercise.course_id_service_id_custom_id_index";
  ALTER INDEX "exercise_custom_id_idx"
    RENAME TO "exercise.custom_id_index";
  ALTER INDEX "exercise_service_id_idx"
    RENAME TO "exercise.service_id_index";
`)

  await knex.raw(`
  ALTER INDEX "exercise_completion_user_id_exercise_id_timestamp_updated_a_idx"
    RENAME TO "exercise_completion.user_id_exercise_id_ordered_index";
`)

  await knex.raw(`
  ALTER INDEX "open_university_registration_link_course_id_idx"
    RENAME TO "open_university_registration_link.course_id_index";
`)

  await knex.raw(`
  ALTER INDEX "organization_creator_id_idx"
    RENAME TO "organization.creator_id_index";
`)

  await knex.raw(`
  ALTER INDEX "organization_translation_organization_id_idx"
    RENAME TO "organization_translation.organization_id_index";
`)

  await knex.raw(`
  ALTER INDEX "stored_data_user_id_idx"
    RENAME TO "stored_data.user_id_index";
`)

  await knex.raw(`
  ALTER INDEX "study_module_translation_study_module_id_language_idx"
    RENAME TO "study_module_translation.study_module_id_language_index";
`)

  await knex.raw(`
  ALTER INDEX "user_email_idx"
    RENAME TO "user.trgm_email_index";
  ALTER INDEX "user_first_name_last_name_idx"
    RENAME TO "user.trgm_first_name_last_name_index";
  ALTER INDEX "user_last_name_idx"
    RENAME TO "user.trgm_last_name_index";
`)

  await knex.raw(`
  ALTER INDEX "user_course_progress_course_id_user_id_idx"
    RENAME TO "user_course_progress.course_id_user_id";
  ALTER INDEX "user_course_progress_user_id_idx"
    RENAME TO "user_course_progress.user_id_index";
`)

  await knex.raw(`
  ALTER INDEX "user_course_service_progress_course_id_idx"
    RENAME TO "user_course_service_progress.course_id_index";
  ALTER INDEX "user_course_service_progress_service_id_course_id_user_id_idx"
    RENAME TO "user_course_service_progress.service_id_course_id_user_id";
  ALTER INDEX "user_course_service_progress_user_id_idx"
    RENAME TO "user_course_service_progress.user_id_index";
`)

  await knex.raw(`
  ALTER INDEX "user_course_setting_country_idx"
    RENAME TO "user_course_setting.country_index";
  ALTER INDEX "user_course_setting_course_id_user_id_created_at_idx"
    RENAME TO "user_course_setting.course_user_ordered_index";
  ALTER INDEX "user_course_setting_language_idx"
    RENAME TO "user_course_setting.language_index";
  ALTER INDEX "user_course_setting_user_id_idx"
    RENAME TO "user_course_setting.user_id";
`)
}
