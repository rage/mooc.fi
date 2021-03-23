import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasColumn("user", "password_reset").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("user", function (table) {
        table.string("password_reset", 255)
      })
    }
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.dropColumn("password_reset")
  })
}
