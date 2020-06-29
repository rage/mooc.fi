import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("completion", function (table) {
    table.boolean("eligible_for_ects").defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("completion", function (table) {
    table.dropColumn("eligible_for_ects")
  })
}
