import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "spent_courses_handoff_continuation" (
      jti UUID PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL
    );
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "spent_courses_handoff_continuation";
  `)
}
