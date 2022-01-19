import { Knex } from "knex"

import { extensionPath } from "../config"
import { createUUIDExtension } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createUUIDExtension(knex)

  await knex.raw(
    `ALTER TABLE "clients" ALTER COLUMN "id" SET DEFAULT ${extensionPath}uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "authorization_codes" ALTER COLUMN "id" SET DEFAULT ${extensionPath}uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "access_tokens" ALTER COLUMN "id" SET DEFAULT ${extensionPath}uuid_generate_v4();`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
