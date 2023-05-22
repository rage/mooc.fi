import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX "_CourseToTag_B_index"
      ON "_CourseToTag" ("B");
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // do nothing
}
