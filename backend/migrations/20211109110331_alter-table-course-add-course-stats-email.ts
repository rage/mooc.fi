import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ONLY "course" 
      ADD COLUMN "course_stats_email_id" UUID;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE ONLY "course" 
      DROP COLUMN "course_stats_email_id";
  `)
}
