import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ab_enrollment
      ALTER COLUMN user_id DROP NOT NULL;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ab_enrollment
      ALTER COLUMN user_id SET NOT NULL;
  `)
}
