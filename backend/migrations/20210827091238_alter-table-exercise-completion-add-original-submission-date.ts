import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE exercise_completion
    ADD COLUMN IF NOT EXISTS original_submission_date TIMESTAMP(3) WITHOUT TIME ZONE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE exercise_completion
    DROP COLUMN original_submission_date;
  `)
}
