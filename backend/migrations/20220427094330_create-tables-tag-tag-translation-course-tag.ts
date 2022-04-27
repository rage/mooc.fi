import { Knex } from "knex"

import { extensionPath } from "../config"
import { createUUIDExtension } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await createUUIDExtension(knex)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "tag" (
      "id" uuid NOT NULL DEFAULT ${extensionPath}uuid_generate_v4(),
      "color" text,
      "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP 
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "tag_translation" (
      "tag_id" uuid NOT NULL,
      "language" text NOT NULL,
      "name" text NOT NULL,
      "description" text,
      "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "course_tag" (
      "course_id" uuid NOT NULL,
      "tag_id" uuid NOT NULL,
      "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP  
    );
  `)

  await knex.raw(`
    ALTER TABLE "tag"
      ADD CONSTRAINT tag_pkey PRIMARY KEY ("id");
  `)

  await knex.raw(`
    ALTER TABLE "tag_translation"
      ADD CONSTRAINT tag_translation_pkey PRIMARY KEY ("tag_id", "language");
  `)

  await knex.raw(`
    ALTER TABLE "course_tag"
      ADD CONSTRAINT course_tag_pkey PRIMARY KEY ("course_id", "tag_id");
  `)

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "tag_translation.name_language._UNIQUE" 
      ON "tag_translation" ("name", "language");
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "tag";
  `)
  await knex.raw(`
    DROP TABLE IF EXISTS "tag_translation";
  `)
  await knex.raw(`
    DROP TABLE IF EXISTS "course_tag";
  `)
}
