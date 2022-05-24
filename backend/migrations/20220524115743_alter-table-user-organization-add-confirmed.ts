import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization"
      ADD COLUMN IF NOT EXISTS "confirmed" BOOLEAN DEFAULT FALSE;
  `)
  await knex.raw(`
    ALTER TABLE "user_organization"
      ADD COLUMN IF NOT EXISTS "confirmed_at" TIMESTAMP(3) WITHOUT TIME ZONE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization"
      DROP COLUMN IF EXISTS "confirmed_at";
  `)
  await knex.raw(`
    ALTER TABLE "user_organization"
      DROP COLUMN IF EXISTS "confirmed";
  `)
}
