import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_settings.user_id" ON "user_course_settings" USING btree ("user_id");
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_settings.course_id" ON "user_course_settings" USING btree ("course_id");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_settings.user_id";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_settings.course_id";
  `)
}
