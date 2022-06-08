import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "organization"
      ADD COLUMN IF NOT EXISTS "required_confirmation" BOOLEAN DEFAULT true;
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      ADD COLUMN IF NOT EXISTS "required_organization_email" TEXT;
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      ADD COLUMN IF NOT EXISTS "join_organization_email_template_id" UUID;
  `)
  await knex.raw(`
    ALTER TABLE ONLY "organization"
      ADD CONSTRAINT "organization_email_template_join_organization_email_template_id_fkey" FOREIGN KEY ("join_organization_email_template_id") REFERENCES email_template("id") ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ONLY "organization"
      DROP CONSTRAINT "organization_email_template_join_organization_email_template_id_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      DROP COLUMN IF EXISTS "join_organization_email_template_id";
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      DROP COLUMN IF EXISTS "required_organization_email";
  `)
  await knex.raw(`
    ALTER TABLE "organization"
      DROP COLUMN IF EXISTS "required_confirmation";
  `)
}
