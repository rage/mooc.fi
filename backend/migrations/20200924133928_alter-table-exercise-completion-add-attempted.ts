import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasColumn("exercise_completion", "attempted")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("exercise_completion", function (table) {
          table.boolean("attempted").nullable().defaultTo(null)
        })
      }
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("exercise_completion", function (table) {
    table.dropColumn("attempted")
  })
}
