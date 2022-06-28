import { extensionPath } from "../config"
import { createUUIDExtension } from "../util/db-functions"
import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await createUUIDExtension(knex)

  await knex.raw(
    `ALTER TABLE "ab_study" ALTER COLUMN "id" SET DEFAULT ${extensionPath}uuid_generate_v4();`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
