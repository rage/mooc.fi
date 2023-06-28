import { Knex } from "knex"

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema
    .hasColumn("course", "upcoming_active_link")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("course", function (table) {
          table.boolean("upcoming_active_link").defaultTo(false)
        })
      }
      return
    })
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.alterTable("course", function (table) {
    table.dropColumn("upcoming_active_link")
  })
}
