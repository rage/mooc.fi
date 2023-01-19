import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE email_template
    ADD COLUMN course_instance_language text;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE email_template
    DROP COLUMN course_instance_language;
  `)
}
