import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "course_tag"
      RENAME TO "_CourseToTag";
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      DROP CONSTRAINT course_tag_pkey,
      DROP CONSTRAINT course_tag_tag_fkey;
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      RENAME COLUMN "tag_id" TO "B";
    ALTER TABLE "_CourseToTag"
      RENAME COLUMN "course_id" TO "A";
  `)
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "_CourseToTag_AB_unique" ON "_CourseToTag" USING btree ("A", "B");
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      ADD CONSTRAINT "_CourseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "course" ("id") ON DELETE CASCADE,
      ADD CONSTRAINT "_CourseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      DROP CONSTRAINT "_CourseToTag_A_fkey",
      DROP CONSTRAINT "_CourseToTag_B_fkey";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "_CourseToTag_AB_unique";
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      RENAME COLUMN "B" TO "tag_id";
    ALTER TABLE "_CourseToTag"
      RENAME COLUMN "A" TO "course_id";
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      ADD CONSTRAINT course_tag_pkey PRIMARY KEY ("course_id", "tag_id");
    ALTER TABLE "_CourseToTag"
      ADD CONSTRAINT course_tag_tag_fkey FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "_CourseToTag"
      RENAME TO "course_tag";
  `)
}
