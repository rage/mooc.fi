import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "course_stats_subscription" (
      "id" uuid NOT NULL DEFAULT ${EXTENSION_PATH}.uuid_generate_v4(),
      "email_template_id" uuid,
      "user_id" uuid,
      "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_subscription"
      ADD CONSTRAINT course_stats_subscription_pkey PRIMARY KEY ("id");
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_subscription"
      ADD CONSTRAINT course_stats_subscription_email_template FOREIGN KEY ("email_template_id") REFERENCES "email_template"("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_subscription"
      ADD CONSTRAINT course_stats_subscription_user FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "course_stats_subscription.user_id_email_template_id._UNIQUE" 
      ON "course_stats_subscription" USING btree ("user_id", "email_template_id");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "course_stats_subscription";
  `)
}
