import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_setting.user_id" ON "user_course_setting" USING btree ("user_id");
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_setting.course_id" ON "user_course_setting" USING btree ("course_id");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.user_id";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.course_id";
  `)
}
