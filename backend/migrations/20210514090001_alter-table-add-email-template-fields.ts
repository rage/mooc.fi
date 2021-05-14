import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS points_threshold INTEGER;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS execise_completions_threshold INTEGER;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS triggered_automatically_by_course_id uuid;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS type STRING;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN points_threshold;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN points_threshold execise_completions_threshold;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN points_threshold triggered_automatically_by_course_id;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN type;
  `)
}
