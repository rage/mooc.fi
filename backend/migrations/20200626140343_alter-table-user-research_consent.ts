import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.boolean("research_consent")
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.dropColumn("research_consent")
  })
}
