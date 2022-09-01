import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .hasColumn("course", "automatic_completions_eligible_for_ects")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("course", function (table) {
          table
            .boolean("automatic_completions_eligible_for_ects")
            .defaultTo(true)
        })
      }
      return
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("course", function (table) {
    table.dropColumn("automatic_completions_eligible_for_ects")
  })
}
