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
      ADD CONSTRAINT stored_data FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE ONLY stored_data
      ADD CONSTRAINT stored_data_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE stored_data;
  `)
}
