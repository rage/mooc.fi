import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "completion_registered"
      ADD COLUMN IF NOT EXISTS "course_code" TEXT;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "completion_registered_completion_id_course_code_key"
      ON "completion_registered" USING btree ("completion_id", "course_code");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered_completion_id_course_code_key";
  `)
  await knex.raw(`
    ALTER TABLE "completion_registered"
      DROP COLUMN IF EXISTS "course_code";
  `)
}
