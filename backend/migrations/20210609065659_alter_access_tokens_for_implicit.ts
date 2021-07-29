import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.hasColumn("access_tokens", "email").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("access_tokens", function (table) {
        table.json("email").nullable().defaultTo(null)
      })
    }
  })

  await knex.schema.hasColumn("access_tokens", "iss").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("access_tokens", function (table) {
        table.json("iss").nullable().defaultTo(null)
      })
    }
  })

  await knex.schema.hasColumn("access_tokens", "nonce").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("access_tokens", function (table) {
        table.json("nonce").nullable().defaultTo(null)
      })
    }
  })

  await knex.schema.hasColumn("access_tokens", "nonce").then((exists) => {
    if (!exists) {
      return knex.schema.alterTable("access_tokens", function (table) {
        table.json("nonce").nullable().defaultTo(null)
      })
    }
  })

  await knex.raw(
    `ALTER TABLE "access_tokens" ALTER COLUMN "client_id" DROP NOT NULL;`,
  )
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("access_tokens", function (table) {
    table.dropColumn("email")
  })

  await knex.schema.alterTable("access_tokens", function (table) {
    table.dropColumn("iss")
  })

  await knex.schema.alterTable("access_tokens", function (table) {
    table.dropColumn("nonce")
  })
}
