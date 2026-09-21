import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "completion"
      ADD COLUMN IF NOT EXISTS credit_registration_justification TEXT,
      ADD COLUMN IF NOT EXISTS credit_registration_identification_answer TEXT;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "completion"
      DROP COLUMN IF EXISTS credit_registration_justification,
      DROP COLUMN IF EXISTS credit_registration_identification_answer;
  `)
}
