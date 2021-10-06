import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD COLUMN IF NOT EXISTS organization TEXT;
  `)
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "verified_user" DROP COLUMN organization;
  `)
}

