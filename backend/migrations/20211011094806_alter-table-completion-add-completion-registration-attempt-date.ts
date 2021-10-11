import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE completion
      ADD COLUMN IF NOT EXISTS completion_registration_attempt_date TIMESTAMP(3) WITHOUT TIME ZONE;
  `)
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE completion 
      DROP COLUMN completion_registration_attempt_date;
  `)
}

