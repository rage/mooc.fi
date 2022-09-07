import { Knex } from "knex"

import { extensionPath } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    ALTER TABLE ONLY ab_enrollment
      DROP CONSTRAINT ab_enrollment_pkey;
  `)
  await knex.raw(`
    ALTER TABLE ab_enrollment
      ADD COLUMN IF NOT EXISTS id UUID NOT NULL DEFAULT ${extensionPath}uuid_generate_v4();
  `)
  await knex.raw(`
    ALTER TABLE ONLY ab_enrollment
      ADD CONSTRAINT ab_enrollment_pkey PRIMARY KEY (id);
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ab_enrollment.user_id_ab_study_id._UNIQUE"
      ON ab_enrollment USING btree (user_id, ab_study_id);
`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "ab_enrollment.user_id_ab_study_id._UNIQUE";
  `)
  await knex.raw(`
    ALTER TABLE ab_enrollment
      DROP CONSTRAINT ab_enrollment_pkey;
  `)
  await knex.raw(`
    ALTER TABLE ab_enrollment
      DROP COLUMN id;
  `)

  await knex.raw(`
    ALTER TABLE ONLY ab_enrollment
      ADD CONSTRAINT ab_enrollment_pkey PRIMARY KEY (user_id, ab_study_id);
  `)
}
