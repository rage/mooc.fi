import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE course
      ADD COLUMN IF NOT EXISTS start_date_tmp TIMESTAMP(3) WITHOUT TIME ZONE,
      ADD COLUMN IF NOT EXISTS end_date_tmp TIMESTAMP(3) WITHOUT TIME ZONE;
  `)
  await knex.raw(`
    UPDATE course
      SET start_date_tmp = 
        CASE 
          WHEN start_date = '' THEN NULL 
          ELSE start_date::timestamp 
        END,
          end_date_tmp = 
        CASE 
          WHEN end_date = '' THEN NULL 
          WHEN end_date IS NULL THEN NULL
          ELSE end_date::timestamp 
        END;
  `)
  await knex.raw(`
    ALTER TABLE course
      DROP COLUMN start_date,
      DROP COLUMN end_date;
  `)
  await knex.raw(`
    ALTER TABLE course
      RENAME COLUMN start_date_tmp TO start_date;
    ALTER TABLE course
      RENAME COLUMN end_date_tmp TO end_date;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE course
      ADD COLUMN IF NOT EXISTS start_date_tmp TEXT NOT NULL,
      ADD COLUMN IF NOT EXISTS end_date_tmp TEXT;
  `)
  await knex.raw(`
    UPDATE course
      SET start_date_tmp =
        CASE
          WHEN start_date IS NULL THEN ''
          ELSE start_date::text
        END,
          end_date_tmp =
        CASE
          WHEN end_date IS NULL THEN NULL
          ELSE end_date::text
        END;
  `)
  await knex.raw(`
    ALTER TABLE course
      DROP COLUMN start_date,
      DROP COLUMN end_date;
  `)
  await knex.raw(`
    ALTER TABLE course
      RENAME COLUMN start_date_tmp TO start_date;
    ALTER TABLE course
      RENAME COLUMN end_date_tmp TO end_date;
  `)
}
