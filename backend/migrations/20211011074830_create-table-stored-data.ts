import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "stored_data" (
      created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      data TEXT,
      course_id uuid,
      user_id uuid
    );
  `)

  await knex.raw(`
    ALTER TABLE ONLY stored_data
      ADD CONSTRAINT stored_data_pkey PRIMARY KEY (course_id, user_id);
  `)

  await knex.raw(`
    ALTER TABLE ONLY stored_data
      ADD CONSTRAINT stored_data_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE ONLY stored_data
      ADD CONSTRAINT stored_data_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE SET NULL;
  `)

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "stored_data.course_id_user_id._UNIQUE"
      ON stored_data USING btree (course_id, user_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "stored_data.course_id_user_id._UNIQUE";
  `)
  await knex.raw(`
    DROP TABLE stored_data;
  `)
}
