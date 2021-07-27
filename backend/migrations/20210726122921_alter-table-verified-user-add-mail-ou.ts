import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD COLUMN IF NOT EXISTS mail text;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD COLUMN IF NOT EXISTS organizational_unit text;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN mail;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN organizational_unit;
  `)
}
