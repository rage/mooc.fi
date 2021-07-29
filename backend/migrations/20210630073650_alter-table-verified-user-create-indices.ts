import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "verified_user.personal_unique_code" ON verified_user USING btree(personal_unique_code);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "verified_user.user_id_personal_unique_code_home_organization" ON verified_user USING btree(user_id, personal_unique_code, home_organization);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "verified_user.personal_unique_code";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "verified_user.user_id_personal_unique_code_home_organization";
  `)
}
