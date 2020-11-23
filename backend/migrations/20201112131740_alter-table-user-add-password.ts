import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`ALTER TABLE user ADD COLUMN IF NOT EXISTS password VARCHAR NOT NULL;`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`ALTER TABLE user DROP COLUMN password;`)
}

