import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .hasColumn("open_university_registration_link", "tiers")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable(
          "open_university_registration_link",
          function (table) {
            table.json("tiers").nullable().defaultTo(null)
          },
        )
      }
      return
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable(
    "open_university_registration_link",
    function (table) {
      table.dropColumn("tiers")
    },
  )
}
