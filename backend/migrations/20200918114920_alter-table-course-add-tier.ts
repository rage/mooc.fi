import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE course
    ADD COLUMN IF NOT EXISTS tier INTEGER;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE course
    DROP COLUMN tier;
  `)
}
