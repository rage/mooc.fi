import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    DROP INDEX IF EXISTS "user.first_name_trgm_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.last_name_trgm_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.username_trgm_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.email_trgm_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.student_number_trgm_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.real_student_number_trgm_index";
  `)

  /* will only work from PSQL >=12/
  await knex.raw(`
    ALTER TABLE "user" ADD COLUMN "text_searchable_index_column" tsvector
      GENERATED ALWAYS AS (to_tsvector('simple', 
        coalesce(first_name, '') || ';' ||
        coalesce(last_name, '') || ';' ||
        coalesce(username, '') || ';' ||
        coalesce(email, '') || ';' ||
        coalesce(student_number, '') || ';' ||
        coalesce(real_student_number, ''))) STORED;
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.text_searchable_index" ON "user"
      USING GIN (text_searchable_index_column ${EXTENSION_PATH}.gin_trgm_ops); 
  `)*/
}

export async function down(knex: Knex): Promise<void> {
  await createExtensions(knex)

  /*await knex.raw(`
    DROP INDEX IF EXISTS "user.text_searchable_index";
  `)
  await knex.raw(`
    ALTER TABLE "user" DROP COLUMN text_searchable_index_column;
  `)*/

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.first_name_trgm_index" ON "user" USING gin (first_name ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.last_name_trgm_index" ON "user" USING gin (last_name ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.username_trgm_index" ON "user" USING gin (username ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.email_trgm_index" ON "user" USING gin (email ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.student_number_trgm_index" ON "user" USING gin (student_number ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.real_student_number_trgm_index" ON "user" USING gin (real_student_number ${EXTENSION_PATH}.gin_trgm_ops);
  `)
}
