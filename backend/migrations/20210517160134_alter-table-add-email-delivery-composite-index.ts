import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `CREATE INDEX IF NOT EXISTS "email_delivery.user_id_email_template_id" ON email_delivery USING btree(user_id, email_template_id);`,
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(
    `DROP INDEX IF EXISTS "email_delivery.user_id_email_template_id";`,
  )
}
