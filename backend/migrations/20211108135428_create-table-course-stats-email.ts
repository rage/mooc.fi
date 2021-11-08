import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "course_stats_email" (
      id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
      course_id uuid,
      email TEXT NOT NULL,
      created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_sent_at timestamp(3) without time zone
    );
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_email"
      ADD CONSTRAINT course_stats_email_pkey PRIMARY KEY (id);
  `)
  await knex.raw(`
    ALTER TABLE "course_stats_email"
      ADD CONSTRAINT course_stats_email_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "course_stats_email.course_id_email._UNIQUE"
      ON "course_stats_email" USING btree (course_id, email);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE "course_stats_email";
  `)
}
