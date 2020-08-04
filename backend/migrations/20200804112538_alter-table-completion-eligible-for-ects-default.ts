import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "eligible_for_ects" SET DEFAULT true;`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
