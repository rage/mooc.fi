import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_completion.user_id_exercise_id_index" ON "exercise_completion" (user_id, exercise_id);
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion.user_idx";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion.user_id_exercise_id_index";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_completion.user_idx" ON "exercise_completion" (user_id);
  `)
}
