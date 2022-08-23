import { Knex } from "knex"

import { extensionPath } from "../config"
import { createUUIDExtension } from "../util"

export async function up(knex: Knex): Promise<void> {
  await createUUIDExtension(knex)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "course_ownership" (
      id uuid NOT NULL DEFAULT ${extensionPath}uuid_generate_v4(),
      course_id uuid,
      user_id uuid,
      created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
  await knex.raw(`
    ALTER TABLE "course_ownership"
      ADD CONSTRAINT course_ownership_pkey PRIMARY KEY (id);
  `)
  await knex.raw(`
    ALTER TABLE "course_ownership"
      ADD CONSTRAINT course_ownership_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_ownership"
      ADD CONSTRAINT course_ownership_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "course_ownership.user_id_course_id._UNIQUE"
      ON "course_ownership" USING btree (user_id, course_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE "course_ownership";
  `)
}
