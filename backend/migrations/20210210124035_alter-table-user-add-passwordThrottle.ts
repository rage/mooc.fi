import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasColumn("user", "password_throttle").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("user", function (table) {
        table.json("password_throttle").nullable().defaultTo(null)
      })
    }
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.dropColumn("password_throttle")
  })
}
