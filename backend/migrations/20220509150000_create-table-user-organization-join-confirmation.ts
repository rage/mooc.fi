import { Knex } from "knex"

import { extensionPath } from "../config"
import { createUUIDExtension } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createUUIDExtension(knex)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "user_organization_join_confirmation" (
      "id" uuid NOT NULL DEFAULT ${extensionPath}uuid_generate_v4(),
      "email" TEXT NOT NULL,
      "user_organization_id" UUID NOT NULL,
      "email_delivery_id" UUID,
      "expired" BOOLEAN NOT NULL DEFAULT FALSE,
      "confirmed" BOOLEAN NOT NULL DEFAULT FALSE,
      "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "expires_at" TIMESTAMP(3),
      "confirmed_at" TIMESTAMP(3)
    );  
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD CONSTRAINT user_organization_join_confirmation_pkey PRIMARY KEY ("id");
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD CONSTRAINT user_organization_join_confirmation_user_organization_fkey FOREIGN KEY ("user_organization_id") REFERENCES "user_organization"("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD CONSTRAINT user_organization_join_confirmation_email_delivery_fkey FOREIGN KEY ("email_delivery_id") REFERENCES "email_delivery"("id") ON DELETE SET NULL;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "user_organization_join_confirmation";
  `)
}
