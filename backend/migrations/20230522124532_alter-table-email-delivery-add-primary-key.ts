import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "email_delivery"
      ADD CONSTRAINT "email_delivery_pkey" PRIMARY KEY (id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP CONSTRAINT "email_delivery_pkey";
  `)
}
