import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER INDEX "ab_enrollment.user_id_ab_study_id._UNIQUE"
      RENAME TO "ab_enrollment_user_id_ab_study_id_key";
  `)
  await knex.raw(`
    ALTER INDEX "ab_studies.name._UNIQUE"
      RENAME TO "ab_study_name_key";
  `)
  await knex.raw(`
    ALTER INDEX "course.slug._UNIQUE"
      RENAME TO "course_slug_key";
  `)
  await knex.raw(`
    ALTER INDEX "course_alias.course_code._UNIQUE"
      RENAME TO "course_alias_course_code_key";
  `)
  await knex.raw(`
    ALTER INDEX "organization.slug._UNIQUE"
      RENAME TO "organization_slug_key";
    ALTER INDEX "organization.secret_key._UNIQUE"
      RENAME TO "organization_secret_key_key";
  `)
  await knex.raw(`
    ALTER INDEX "study_module.slug._UNIQUE"
      RENAME TO "study_module_slug_key";
  `)
  await knex.raw(`
    ALTER INDEX "user.upstream_id._UNIQUE"
      RENAME TO "user_upstream_id_key";
    ALTER INDEX "user.username._UNIQUE"
      RENAME TO "user_username_key";
  `)
  await knex.raw(`
    ALTER INDEX "course_ownership.user_id_course_id._UNIQUE"
      RENAME TO "course_ownership_user_id_course_id_key";
  `)
  await knex.raw(`
    ALTER INDEX "course_stats_subscription.user_id_email_template_id._UNIQUE"
      RENAME TO "course_stats_subscription_user_id_email_template_id_key";
  `)
  await knex.raw(`
    ALTER INDEX "tag_translation.name_language._UNIQUE"
      RENAME TO "tag_translation_name_language_key";
  `)
  await knex.raw(`
    ALTER INDEX "UserAppDatumConfig.name._UNIQUE"
      RENAME TO "user_app_datum_config_name_key";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER INDEX "ab_enrollment_user_id_ab_study_id_key"
      RENAME TO "ab_enrollment.user_id_ab_study_id._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "ab_study_name_key"
      RENAME TO "ab_studies.name._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "course_slug_key"
      RENAME TO "course.slug._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "course_alias_course_code_key"
      RENAME TO "course_alias.course_code._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "organization_slug_key"
      RENAME TO "organization.slug._UNIQUE";
    ALTER INDEX "organization_secret_key_key"
      RENAME TO "organization.secret_key._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "study_module_slug_key"
      RENAME TO "study_module.slug._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "user_upstream_id_key"
      RENAME TO "user.upstream_id._UNIQUE";
    ALTER INDEX "user_username_key"
      RENAME TO "user.username._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "course_ownership_user_id_course_id_key"
      RENAME TO "course_ownership.user_id_course_id._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "course_stats_subscription_user_id_email_template_id_key"
      RENAME TO "course_stats_subscription.user_id_email_template_id._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "tag_translation_name_language_key"
      RENAME TO "tag_translation.name_language._UNIQUE";
  `)
  await knex.raw(`
    ALTER INDEX "user_app_datum_config_name_key"
      RENAME TO "UserAppDatumConfig.name._UNIQUE";
  `)
}
