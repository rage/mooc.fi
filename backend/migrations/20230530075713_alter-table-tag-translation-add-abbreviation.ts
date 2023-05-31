import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "tag_translation"
      ADD COLUMN IF NOT EXISTS abbreviation TEXT;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "tag_translation"
      DROP COLUMN IF EXISTS abbreviation;
  `)
}
