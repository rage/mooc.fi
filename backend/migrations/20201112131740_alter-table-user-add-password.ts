import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasColumn("user", "password").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("user", function (table) {
        table.string("password", 255).nullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("user", function (table) {
    table.dropColumn("password")
  })
}
