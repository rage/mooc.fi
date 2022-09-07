import { Knex } from "knex"

import { extensionPath } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.first_name_trgm_index" ON "user" USING gin (first_name ${extensionPath}gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.last_name_trgm_index" ON "user" USING gin (last_name ${extensionPath}gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.username_trgm_index" ON "user" USING gin (username ${extensionPath}gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.email_trgm_index" ON "user" USING gin (email ${extensionPath}gin_trgm_ops);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.student_number_trgm_index" ON "user" USING gin (student_number ${extensionPath}gin_trgm_ops);  
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "user.real_student_number_trgm_index" ON "user" USING gin (real_student_number ${extensionPath}gin_trgm_ops);
  `)
}

export async function down(knex: Knex): Promise<void> {
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
}
