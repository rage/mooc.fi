import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  try {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "extensions";`)
    await knex.raw(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "extensions";`,
    )
  } catch {
    Boolean(process.env.DEBUG) &&
      console.warn(
        "Error creating uuid-ossp extension. Ignore if this didn't fall on next hurdle",
      )
  }

  await knex.raw(`CREATE TABLE IF NOT EXISTS ab_enrollment (
    user_id uuid,
    ab_study_id uuid,
    "group" integer,
    created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`)

  await knex.raw(`CREATE TABLE IF NOT EXISTS ab_study (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    name text,
    group_count integer NOT NULL,
    created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`)

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`ALTER TABLE ONLY ab_enrollment
        ADD CONSTRAINT ab_enrollment_pkey PRIMARY KEY (user_id, ab_study_id);`)
      await trx.raw(`ALTER TABLE ONLY ab_study
        ADD CONSTRAINT ab_study_pkey PRIMARY KEY (id);`)
    })
  } catch {
    console.log(
      "Error adding primary key constraints; probably existed already",
    )
  }

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ab_studies.name._UNIQUE"
      ON ab_study USING btree (name);`)

  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`ALTER TABLE ONLY ab_enrollment
        ADD CONSTRAINT ab_enrollment_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL;`)
      await trx.raw(`ALTER TABLE ONLY ab_enrollment
        ADD CONSTRAINT ab_enrollment_ab_study FOREIGN KEY (ab_study_id) REFERENCES ab_study(id) ON DELETE SET NULL;`)
    })
  } catch {
    console.log(
      "Error adding foreign key constraints; probably existed already",
    )
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE ab_enrollment;`)
  await knex.raw(`DROP TABLE ab_study;`)
}
