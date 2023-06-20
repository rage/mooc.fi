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
    CREATE TABLE IF NOT EXISTS "_CourseToSponsor" (
      "A" UUID NOT NULL,
      "B" TEXT NOT NULL,
      CONSTRAINT "_CourseToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "course"(id) ON DELETE CASCADE,
      CONSTRAINT "_CourseToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "sponsor"(id) ON DELETE CASCADE
    );
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "_CourseToSponsor_AB_unique" ON "_CourseToSponsor" USING btree ("A", "B");
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "_CourseToSponsor_B" ON "_CourseToSponsor" ("B");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "_CourseToSponsor";
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
