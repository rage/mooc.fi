import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE user_course_progress 
      ADD COLUMN IF NOT EXISTS extra JSON;  
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE user_course_progress
      DROP COLUMN extra;
  `)
}
