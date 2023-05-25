import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "exercise_completion_required_actions"
      DROP CONSTRAINT "exercise_completion_required_actions_exercise_completion_i_fkey",
      ADD CONSTRAINT "exercise_completion_required_actions_exercise_completion_i_fkey"
        FOREIGN KEY ("exercise_completion_id") REFERENCES "exercise_completion"("id") 
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "open_university_registration_link"
      DROP CONSTRAINT "open_university_registration_link_course_id_fkey",
      ADD CONSTRAINT "open_university_registration_link_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id") 
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "organization_translation"
      DROP CONSTRAINT "organization_translation_organization_id_fkey",
      ADD CONSTRAINT "organization_translation_organization_id_fkey"
        FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "study_module_translation"
      DROP CONSTRAINT "study_module_translation_study_module_id_fkey",
      ADD CONSTRAINT "study_module_translation_study_module_id_fkey"
        FOREIGN KEY ("study_module_id") REFERENCES "study_module"("id")
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_alias"
      DROP CONSTRAINT "course_alias_course_id_fkey",
      ADD CONSTRAINT "course_alias_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_translation"
      DROP CONSTRAINT "course_translation_course_id_fkey",
      ADD CONSTRAINT "course_translation_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE CASCADE;
  `)
  await knex.raw(`
    ALTER TABLE "course_variant"
      DROP CONSTRAINT "course_variant_course_id_fkey",
      ADD CONSTRAINT "course_variant_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE CASCADE;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "exercise_completion_required_actions"
      DROP CONSTRAINT "exercise_completion_required_actions_exercise_completion_i_fkey",
      ADD CONSTRAINT "exercise_completion_required_actions_exercise_completion_i_fkey"
        FOREIGN KEY ("exercise_completion_id") REFERENCES "exercise_completion"("id")
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "open_university_registration_link"
      DROP CONSTRAINT "open_university_registration_link_course_id_fkey",
      ADD CONSTRAINT "open_university_registration_link_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "organization_translation"
      DROP CONSTRAINT "organization_translation_organization_id_fkey",
      ADD CONSTRAINT "organization_translation_organization_id_fkey"
        FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "study_module_translation"
      DROP CONSTRAINT "study_module_translation_study_module_id_fkey",
      ADD CONSTRAINT "study_module_translation_study_module_id_fkey"
        FOREIGN KEY ("study_module_id") REFERENCES "study_module"("id")
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "course_alias"
      DROP CONSTRAINT "course_alias_course_id_fkey",
      ADD CONSTRAINT "course_alias_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")  
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "course_translation"
      DROP CONSTRAINT "course_translation_course_id_fkey",
      ADD CONSTRAINT "course_translation_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE SET NULL;
  `)
  await knex.raw(`
    ALTER TABLE "course_variant"
      DROP CONSTRAINT "course_variant_course_id_fkey",
      ADD CONSTRAINT "course_variant_course_id_fkey"
        FOREIGN KEY ("course_id") REFERENCES "course"("id")
        ON DELETE SET NULL;
  `)
}
