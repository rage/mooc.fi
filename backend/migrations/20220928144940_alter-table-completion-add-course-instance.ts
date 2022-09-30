import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE completion
      ADD COLUMN course_instance_id uuid;
  `)
  await knex.raw(`
    ALTER TABLE completion
      ADD CONSTRAINT completion_course_instance_fkey FOREIGN KEY (course_instance_id) REFERENCES course(id) ON DELETE SET NULL;
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "completion.course_instance_id"
      ON completion USING btree (course_instance_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "completion.course_instance_id";
  `)
  await knex.raw(`
    ALTER TABLE completion
      DROP CONSTRAINT completion_course_instance_fkey;
  `)
  await knex.raw(`
    ALTER TABLE completion
      DROP COLUMN course_instance_id;
  `)
}
