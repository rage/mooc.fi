import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ONLY "email_delivery"
      ADD CONSTRAINT "email_delivery_pkey" PRIMARY KEY ("id");
  `)
  await knex.raw(`
    ALTER TABLE "email_delivery"
      ADD COLUMN IF NOT EXISTS "email" TEXT;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP COLUMN IF EXISTS "email";
  `)
  await knex.raw(`
    ALTER TABLE ONLY "email_delivery"
      DROP CONSTRAINT "email_delivery_pkey";
  `)
}
