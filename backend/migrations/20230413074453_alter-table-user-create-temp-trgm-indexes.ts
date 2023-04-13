import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.trgm_first_name_last_name_index" 
      ON "user" USING GIN (
        first_name ${EXTENSION_PATH}.gin_trgm_ops, 
        last_name ${EXTENSION_PATH}.gin_trgm_ops
      );
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.trgm_email_index"
      ON "user" USING GIN (email ${EXTENSION_PATH}.gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.trgm_last_name_index"
      ON "user" USING GIN (last_name ${EXTENSION_PATH}.gin_trgm_ops);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "user.trgm_first_name_last_name_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.trgm_email_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "user.trgm_last_name_index";
  `)
}
