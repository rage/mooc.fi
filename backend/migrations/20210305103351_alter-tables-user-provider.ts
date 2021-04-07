import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.hasColumn("user", "client_id").then((exists) => {
        if (!exists) {
            return knex.schema.alterTable("user", function (table) {
                table.boolean("client_id")
            })
        }
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.alterTable("user", function (table) {
        table.dropColumn("client_id")
    })
}
