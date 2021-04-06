import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasColumn("completion", "completion_date")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("completion", function (table) {
          table.dateTime("completion_date")
        })
      }
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("completion", function (table) {
    table.dropColumn("completion_date")
  })
}
