import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .hasColumn("completion", "eligible_for_ects")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("completion", function (table) {
          table.boolean("eligible_for_ects").defaultTo(true)
        })
      }
      return
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("completion", function (table) {
    table.dropColumn("eligible_for_ects")
  })
}
