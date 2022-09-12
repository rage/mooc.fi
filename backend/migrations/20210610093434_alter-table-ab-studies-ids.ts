import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(
    `ALTER TABLE "ab_study" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
