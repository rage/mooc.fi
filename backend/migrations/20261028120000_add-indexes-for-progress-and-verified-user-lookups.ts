import { Knex } from "knex"

// CONCURRENTLY cannot run inside a transaction.
export const config = { transaction: false }

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS "exercise_completion_required_actions.completion_id_index"
      ON "exercise_completion_required_actions" (exercise_completion_id);
  `)
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS "user_organization.user_id_index"
      ON "user_organization" (user_id);
  `)
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS "verified_user.user_id_index"
      ON "verified_user" (user_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX CONCURRENTLY IF EXISTS "exercise_completion_required_actions.completion_id_index";
  `)
  await knex.raw(`
    DROP INDEX CONCURRENTLY IF EXISTS "user_organization.user_id_index";
  `)
  await knex.raw(`
    DROP INDEX CONCURRENTLY IF EXISTS "verified_user.user_id_index";
  `)
}
