import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE TABLE IF NOT EXISTS authorization_codes (
        id uuid NOT NULL,
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp(3) without time zone,
        client_id text NOT NULL,
        redirect_uri text NOT NULL,
        code text NOT NULL,
        trusted boolean DEFAULT false,
        user_id uuid REFERENCES "user"(id) ON DELETE SET NULL
    );`)
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw("DROP TABLE authorization_codes")
}
