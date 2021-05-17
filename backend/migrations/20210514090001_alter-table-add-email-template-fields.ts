import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS points_threshold INTEGER;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS exercise_completions_threshold INTEGER;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS triggered_automatically_by_course_id STRING;
  `)
  await knex.raw(`ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS type STRING;
  `)
  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`ALTER TABLE ONLY email_template
        ADD CONSTRAINT course_threshold_email_fkey FOREIGN KEY (triggered_automatically_by_course) REFERENCES course(id) ON DELETE SET NULL;`)
    })
  } catch {
    console.log("Error adding foreign key constraints.")
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN points_threshold;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN exercise_completions_threshold;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN triggered_automatically_by_course_id;
  `)
  await knex.raw(`ALTER TABLE email_template
    DROP COLUMN type;
  `)
}
