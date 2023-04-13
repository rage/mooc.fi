import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion_user_idx";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_course_idx";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX "completion_user_idx" ON "completion" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX "exercise_course_idx" ON "exercise" (course_id);
  `)
}
