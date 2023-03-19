import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion.completion_language_index" ON "completion" (completion_language);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion.completion_language_index";
  `)
}
