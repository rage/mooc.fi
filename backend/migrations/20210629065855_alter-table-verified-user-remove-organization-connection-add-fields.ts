import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
        ALTER TABLE "verified_user" 
          DROP CONSTRAINT verified_user_organization_user_puc_constraint;
      `)
      await trx.raw(`
        ALTER TABLE "verified_user"
          DROP COLUMN organization_id;
      `)
    })
  } catch {}

  await knex.raw(`
    ALTER TABLE "verified_user" 
      ADD COLUMN IF NOT EXISTS home_organization text; 
  `)
  await knex.raw(`
    ALTER TABLE "verified_user" 
      ADD COLUMN IF NOT EXISTS person_affiliation text; 
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD COLUMN IF NOT EXISTS person_affiliation_updated_at timestamp(3) without time zone;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD CONSTRAINT verified_user_user_id_puc_home_organization_constraint UNIQUE (user_id, personal_unique_code, home_organization);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "verified_user" 
      DROP CONSTRAINT verified_user_user_id_puc_home_organization_constraint;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN person_affiliation_updated_at;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN person_affiliation;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN home_organization;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD COLUMN organization_id uuid;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD CONSTRAINT verified_user_organization_fkey FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD CONSTRAINT verified_user_organization_user_puc_constraint UNIQUE (organization_id, user_id, personal_unique_code);
  `)
}
