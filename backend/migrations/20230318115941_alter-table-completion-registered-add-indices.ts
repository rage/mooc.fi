import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.user_id_index" ON "completion_registered" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.course_id_index" ON "completion_registered" (course_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.completion_id_index" ON "completion_registered" (completion_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.completion_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.course_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.user_id_index";
  `)
}
