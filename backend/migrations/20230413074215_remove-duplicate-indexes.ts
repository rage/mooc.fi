import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "tag_translation.tag_id_language_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "stored_data.course_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion_user_idx";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion_required_actions.value_index";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX "tag_translation.tag_id_language_index" ON "tag_translation" (tag_id, language);
  `)
  await knex.raw(`
    CREATE INDEX "stored_data.course_id_index" ON "stored_data" (course_id);
  `)
  await knex.raw(`
    CREATE INDEX "exercise_completion_user_idx" ON "exercise_completion" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX "exercise_completion_required_actions.value_index" ON "exercise_completion_required_actions" (value);
  `)
}
