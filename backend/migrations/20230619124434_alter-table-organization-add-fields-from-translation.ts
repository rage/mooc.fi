import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "organization"
      ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS "disabled_reason" TEXT,
      ADD COLUMN IF NOT EXISTS "information" TEXT;
  `)
  await knex.raw(`
    ALTER TABLE "organization_translation"
      DROP COLUMN IF EXISTS "disabled_reason";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "organization"
      DROP COLUMN IF EXISTS "name",
      DROP COLUMN IF EXISTS "disabled_reason",
      DROP COLUMN IF EXISTS "information";
  `)
  await knex.raw(`
    ALTER TABLE "organization_translation"
      ADD COLUMN IF NOT EXISTS "disabled_reason" TEXT;
  `)
}
