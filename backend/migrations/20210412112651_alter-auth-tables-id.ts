import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "clients" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "authorization_codes" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "access_tokens" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4();`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
