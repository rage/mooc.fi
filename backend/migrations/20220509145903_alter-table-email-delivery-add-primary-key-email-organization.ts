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
  await knex.raw(`
    ALTER TABLE "email_delivery"
      ADD COLUMN IF NOT EXISTS "organization_id" UUID;
  `)
  await knex.raw(`
    ALTER TABLE "email_delivery"
      ADD CONSTRAINT "email_delivery_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP CONSTRAINT "email_delivery_organization_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP COLUMN IF EXISTS "organization_id";
  `)
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP COLUMN IF EXISTS "email";
  `)
  await knex.raw(`
    ALTER TABLE ONLY "email_delivery"
      DROP CONSTRAINT "email_delivery_pkey";
  `)
}
