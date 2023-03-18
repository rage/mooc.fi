import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "stored_data.user_id_index" ON "stored_data" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "stored_data.course_id_index" ON "stored_data" (course_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "stored_data.course_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "stored_data.user_id_index";
  `)
}
