import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE TABLE IF NOT EXISTS clients (
        id uuid NOT NULL,
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone,
        name text NOT NULL,
        client_id text UNIQUE NOT NULL,
        client_secret text NOT NULL,
        redirect_uri text,
        scopes text,
        is_trusted boolean DEFAULT true
    );`)
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw("DROP TABLE clients")
}
