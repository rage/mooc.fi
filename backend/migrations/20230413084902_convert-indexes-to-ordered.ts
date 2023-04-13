import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion.user_id_course_id_ordered_index"
      ON "completion" (user_id, course_id, created_at ASC);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion.course_id_user_id_ordered_index"
      ON "completion" (course_id, user_id, created_at ASC);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion.course_id_user_id";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_setting.course_id_ordered_index"
      ON "user_course_setting" (course_id, created_at ASC);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.course_id";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_completion.user_id_exercise_id_ordered_index"
      ON "exercise_completion" (user_id, exercise_id, timestamp DESC, updated_at DESC);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion.user_id_exercise_id_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise.course_id_not_ignored_index"
      ON "exercise" (course_id)
      WHERE deleted <> true AND max_points > 0;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion.user_id_course_id_ordered_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion.course_id_user_id" ON "completion" (course_id, user_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "completion.course_id_user_id_ordered_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user_course_setting.course_id" ON "user_course_setting" (course_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user_course_setting.course_id_ordered_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_completion.user_id_exercise_id_index" ON "exercise_completion" (user_id, exercise_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion.user_id_exercise_id_ordered_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise.course_id_not_ignored_index";
  `)
}
