import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD COLUMN IF NOT EXISTS "activation_code" TEXT,
      ADD COLUMN IF NOT EXISTS "activation_attempts" INTEGER NOT NULL DEFAULT 0;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      DROP COLUMN IF EXISTS "activation_code",
      DROP COLUMN IF EXISTS "activation_attempts";
  `)
}
