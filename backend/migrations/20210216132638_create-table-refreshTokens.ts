import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.raw(`CREATE TABLE IF NOT EXISTS refreshTokens (
        id serial NOT NULL,
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone,
        refreshToken text NOT NULL,
        clientId text NOT NULL,
        userId text NOT NULL
    );` )
}

export async function down(knex: Knex): Promise<any> {
    await knex.raw('DROP TABLE IF EXISTS refreshTokens')
}
