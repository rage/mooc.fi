import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "automatic_completions_eligible_for_ects" SET DEFAULT true;`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
