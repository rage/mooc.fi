import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE completion_registered 
      ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP(3) WITHOUT TIME ZONE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE completion_registered
      DROP COLUMN registration_date;
  `)
}
