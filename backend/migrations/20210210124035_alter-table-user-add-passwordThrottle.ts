import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasColumn("user", "passwordThrottle").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("user", function (table) {
        table.json("passwordThrottle")
      })
    }
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.dropColumn("passwordThrottle")
  })
}
