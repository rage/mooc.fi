import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE TABLE IF NOT EXISTS access_tokens (
        id uuid NOT NULL,
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone,
        access_token text NOT NULL,
        client_id text NOT NULL,
        user_id uuid,
        valid boolean DEFAULT TRUE
    );`)
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw("DROP TABLE IF EXISTS access_tokens")
}
