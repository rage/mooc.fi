import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "_TagToTagType_AB_unique";
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      DROP CONSTRAINT "_TagToTagType_A_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      DROP CONSTRAINT tag_translation_pkey,
      DROP CONSTRAINT tag_translation_tag_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "course_tag"
      DROP CONSTRAINT course_tag_pkey,
      DROP CONSTRAINT course_tag_tag_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      DROP CONSTRAINT tag_pkey;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      ALTER COLUMN "id" TYPE text, 
      ALTER COLUMN "id" SET NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      ALTER COLUMN "tag_id" TYPE text, 
      ALTER COLUMN "tag_id" SET NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "course_tag"
      ALTER COLUMN "tag_id" TYPE text,
      ALTER COLUMN "tag_id" SET NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      ALTER COLUMN "A" TYPE text,
      ALTER COLUMN "A" SET NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      ADD CONSTRAINT tag_pkey PRIMARY KEY ("id");
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      ADD CONSTRAINT tag_translation_pkey PRIMARY KEY ("tag_id", "language");
    ALTER TABLE "tag_translation"
      ADD CONSTRAINT tag_translation_tag_fkey FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_tag"
      ADD CONSTRAINT course_tag_pkey PRIMARY KEY ("course_id", "tag_id");
    ALTER TABLE "course_tag"
      ADD CONSTRAINT course_tag_tag_fkey FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "_TagToTagType_AB_unique" ON "_TagToTagType" USING btree ("A", "B");
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      ADD CONSTRAINT "_TagToTagType_A_fkey" FOREIGN KEY ("A") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await createExtensions(knex)

  await knex.raw(`
    DROP INDEX IF EXISTS "_TagToTagType_AB_unique";
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      DROP CONSTRAINT "_TagToTagType_A_fkey";
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      DROP CONSTRAINT tag_translation_pkey,
      DROP CONSTRAINT tag_translation_tag_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "course_tag"
      DROP CONSTRAINT course_tag_pkey,
      DROP CONSTRAINT course_tag_tag_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      DROP CONSTRAINT tag_pkey;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      DROP COLUMN "id",
      ADD COLUMN "id" uuid NOT NULL DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      DROP COLUMN "tag_id",
      ADD COLUMN "tag_id" uuid NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "course_tag"
      DROP COLUMN "tag_id",
      ADD COLUMN "tag_id" uuid NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      DROP COLUMN "A",
      ADD COLUMN "A" uuid NOT NULL;
  `)
  await knex.raw(`
    ALTER TABLE "tag"
      ADD CONSTRAINT tag_pkey PRIMARY KEY ("id");
  `)
  await knex.raw(`
    ALTER TABLE "tag_translation"
      ADD CONSTRAINT tag_translation_pkey PRIMARY KEY ("tag_id", "language");
    ALTER TABLE "tag_translation"
      ADD CONSTRAINT tag_translation_tag_fkey FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE;
  `)

  await knex.raw(`
  ALTER TABLE "course_tag"
    ADD CONSTRAINT course_tag_pkey PRIMARY KEY ("course_id", "tag_id");
  ALTER TABLE "course_tag"
    ADD CONSTRAINT course_tag_tag_fkey FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "_TagToTagType_AB_unique" ON "_TagToTagType" USING btree ("A", "B");
  `)
  await knex.raw(`
    ALTER TABLE "_TagToTagType"
      ADD CONSTRAINT "_TagToTagType_A_fkey" FOREIGN KEY ("A") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
}
