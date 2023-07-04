import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      DROP CONSTRAINT IF EXISTS user_organization_join_confirmation_user_organization_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD CONSTRAINT user_organization_join_confirmation_user_organization_fkey FOREIGN KEY ("user_organization_id") REFERENCES "user_organization"("id") ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      DROP CONSTRAINT IF EXISTS user_organization_join_confirmation_user_organization_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "user_organization_join_confirmation"
      ADD CONSTRAINT user_organization_join_confirmation_user_organization_fkey FOREIGN KEY ("user_organization_id") REFERENCES "user_organization"("id") ON DELETE SET NULL;
  `)
}
