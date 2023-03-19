import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_course_idx";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_course_idx" ON "completion" (course_id);
  `)
}
