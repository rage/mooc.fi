import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "completion_registered"
      ADD COLUMN IF NOT EXISTS "course_code" TEXT;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "completion_registered"
      DROP COLUMN IF EXISTS "course_code";
  `)
}
