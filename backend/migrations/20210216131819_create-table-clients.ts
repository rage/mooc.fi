import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.raw(`CREATE TABLE IF NOT EXISTS clients (
        id serial NOT NULL,
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone,
        name text NOT NULL,
        clientId text NOT NULL,
        clientSecret text NOT NULL,
        isTrusted boolean DEFAULT true
    );` )
}


export async function down(knex: Knex): Promise<any> {
    await knex.raw('DROP TABLE clients')
}

