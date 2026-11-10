import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD COLUMN IF NOT EXISTS "activation_code" TEXT;
  `)
  await knex.raw(`
    ALTER TABLE "user_organization"
      ADD COLUMN IF NOT EXISTS "activation_failed_attempts" INTEGER NOT NULL DEFAULT 0;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization"
      DROP COLUMN IF EXISTS "activation_failed_attempts";
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      DROP COLUMN IF EXISTS "activation_code";
  `)
}
