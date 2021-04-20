import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "completion_date" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
