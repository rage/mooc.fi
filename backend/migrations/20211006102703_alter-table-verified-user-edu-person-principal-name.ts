import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
          ALTER TABLE "verified_user" DROP CONSTRAINT verified_user_user_id_puc_home_organization_constraint;
        `)
      await trx.raw(`
          ALTER TABLE "verified_user" 
            ADD COLUMN IF NOT EXISTS "edu_person_principal_name" text NOT NULL;
        `)
      await trx.raw(`
          ALTER TABLE "verified_user"
            ADD CONSTRAINT verified_user_user_id_edu_person_principal_name_home_organization UNIQUE (user_id, edu_person_principal_name, home_organization);
        `)
    })
  } catch {
    // ignore if it doesn't exist
  }

  await knex.raw(`
    DROP INDEX IF EXISTS "verified_user.personal_unique_code";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "verified_user.user_id_personal_unique_code_home_organization";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "verified_user.edu_person_principal_name" ON verified_user USING btree(edu_person_principal_name); 
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "verified_user.edu_person_principal_name";
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "verified_user.user_id_personal_unique_code_home_organization" ON verified_user USING btree(user_id, personal_unique_code, home_organization);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "verified_user.personal_unique_code" ON verified_user USING btree(personal_unique_code);
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP CONSTRAINT verified_user_user_id_edu_person_principal_name_home_organization;
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      DROP COLUMN "edu_person_principal_name";
  `)
  await knex.raw(`
    ALTER TABLE "verified_user"
      ADD CONSTRAINT verified_user_user_id_puc_home_organization_constraint UNIQUE (user_id, personal_unique_code, home_organization);
  `)
  await knex.raw(`
  
  `)
}
