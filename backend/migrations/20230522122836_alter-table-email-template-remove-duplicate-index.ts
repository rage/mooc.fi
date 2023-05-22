import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "email_template.triggered_automatically_template_type_index";
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // do nothing
}
