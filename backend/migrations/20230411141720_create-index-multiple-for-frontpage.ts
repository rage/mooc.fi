import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_translation.course_id_language_index" ON "course_translation" (course_id, language);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_translation.name_index" ON "course_translation" (name);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "study_module_translation.study_module_id_language_index" ON "study_module_translation" (study_module_id, language);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "tag_translation.tag_id_language_index" on "tag_translation" (tag_id, language);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course.completions_handled_by_index" on "course" (completions_handled_by_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course.status_index" on "course" (status);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "_CourseToTag_B" ON "_CourseToTag" ("B");
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "_TagToTagType_B" ON "_TagToTagType" ("B");
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_alias.course_id" ON "course_alias" (course_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_variant.course_id" ON "course_variant" (course_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "course_variant.slug" ON "course_variant" (slug);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise.service_id_index" on "exercise" (service_id);
  `)
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS "exercise_completion_required_actions.value_index" on "exercise_completion_required_actions" (value);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS "course_translation.course_id_language_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course_translation.name_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "study_module_translation.study_module_id_language_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "tag_translation.tag_id_language_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course.completions_handled_by_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course.status_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "_CourseToTag_B";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "_TagToTagType_B";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course_alias.course_id";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course_variant.course_id";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "course_variant.slug";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise.service_id_index";
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS "exercise_completion_required_actions.value_index";
  `)
}
