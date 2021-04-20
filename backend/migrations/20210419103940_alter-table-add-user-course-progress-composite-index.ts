import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `CREATE INDEX IF NOT EXISTS "user_course_progress.course_id_user_id" ON user_course_progress USING btree(course_id, user_id);`,
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(
    `DROP INDEX IF EXISTS "user_course_progress.course_id_user_id";`,
  )
}
