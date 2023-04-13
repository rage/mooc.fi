import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_setting.course_user_ordered_index"
      ON "user_course_setting" (course_id, user_id, created_at ASC);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.course_id_ordered_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.user_id_course_id_index"
      ON "completion_registered" (user_id, course_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion_registered.course_id_index"
      ON "completion_registered" (course_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.user_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.course_id_user_id_index";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX "user_course_setting.course_id_ordered_index" ON "user_course_setting" (course_id, created_at ASC);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.course_user_ordered_index";
  `)
  await knex.raw(`
    CREATE INDEX "completion_registered.user_id_index" ON "completion_registered" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX "completion_registered.course_id_user_id_index" ON "completion_registered" (course_id, user_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.user_id_course_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_registered.course_id_index";
  `)
}
