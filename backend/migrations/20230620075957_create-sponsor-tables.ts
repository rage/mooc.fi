import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "sponsor" (
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT sponsor_pkey PRIMARY KEY (id)
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "sponsor_translation" (
      sponsor_id TEXT NOT NULL,
      language TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      link TEXT,
      link_text TEXT,
      created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT sponsor_translation_pkey PRIMARY KEY (sponsor_id, language),
      CONSTRAINT sponsor_translation_sponsor_id_fkey FOREIGN KEY (sponsor_id) REFERENCES "sponsor"(id) ON DELETE CASCADE
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "sponsor_image" (
      sponsor_id TEXT NOT NULL,
      type TEXT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      uri TEXT NOT NULL,
      created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT sponsor_image_pkey PRIMARY KEY (sponsor_id, type),
      CONSTRAINT sponsor_image_sponsor_id_fkey FOREIGN KEY (sponsor_id) REFERENCES "sponsor"(id) ON DELETE CASCADE
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "course_sponsor" (
      course_id uuid NOT NULL,
      sponsor_id TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "course_sponsor_course_id_fkey" FOREIGN KEY (course_id) REFERENCES "course"(id) ON DELETE CASCADE,
      CONSTRAINT "course_sponsor_sponsor_id_fkey" FOREIGN KEY (sponsor_id) REFERENCES "sponsor"(id) ON DELETE CASCADE,
      CONSTRAINT "course_sponsor_pkey" PRIMARY KEY (course_id, sponsor_id)
    );
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_sponsor_sponsor_id_idx" ON "course_sponsor" (sponsor_id);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "course_sponsor";
  `)
  await knex.raw(`
    DROP TABLE IF EXISTS "sponsor_image";
  `)
  await knex.raw(`
    DROP TABLE IF EXISTS "sponsor_translation";
  `)
  await knex.raw(`
    DROP TABLE IF EXISTS "sponsor";
  `)
}
