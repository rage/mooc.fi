import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "verified_user" ADD CONSTRAINT verified_user_organization_user_puc_constraint UNIQUE (organization_id, user_id, personal_unique_code);`,
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "verified_user" DROP CONSTRAINT verified_user_organization_user_puc_constraint;`,
  )
}
