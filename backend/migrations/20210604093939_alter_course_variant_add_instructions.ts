import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .hasColumn("course_variant", "instructions")
    .then((exists) => {
      if (!exists) {
        return knex.schema.alterTable("course_variant", function (table) {
          table.text("instructions").nullable()
        })
      }
      return
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("course_variant", function (table) {
    table.dropColumn("instructions")
  })
}
