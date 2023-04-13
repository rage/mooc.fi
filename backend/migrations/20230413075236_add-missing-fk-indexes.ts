import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.organization_id_index" ON "completion_registered" (organization_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.course_id_user_id_index"
      ON "completion_registered" (course_id, user_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.course_id_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "ab_enrollment.ab_study_id_index" ON "ab_enrollment" (ab_study_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "email_delivery.email_template_id_index" ON "email_delivery" (email_template_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "open_university_registration_link.course_id_index"
      ON "open_university_registration_link" (course_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "organization.creator_id_index" ON "organization" (creator_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "email_template.triggered_automatically_template_type_index"
      ON "email_template" (triggered_automatically_by_course_id, template_type);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course.completion_email_id_index" ON "course" (completion_email_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise.course_id_service_id_custom_id_index" 
      ON "exercise" (course_id, service_id, custom_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_course_idx";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "organization_translation.organization_id_index"
      ON "organization_translation" (organization_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.organization_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "ab_enrollment.ab_study_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "email_delivery.email_template_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "open_university_registration_link.course_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "organization.creator_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "email_template.triggered_automatically_template_type_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course.completion_email_id_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_course_idx" ON "exercise" (course_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise.course_id_service_id_custom_id_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.course_id_index" 
      ON "completion_registered" (course_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.course_id_user_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "organization_translation.organization_id_index";
  `)
}
