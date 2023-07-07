import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization" 
      ADD COLUMN IF NOT EXISTS "organizational_identifier" TEXT;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization" 
      DROP COLUMN IF EXISTS "organizational_identifier";
  `)
}
