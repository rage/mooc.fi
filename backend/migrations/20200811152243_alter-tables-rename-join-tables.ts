import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "_CourseToService" RENAME TO "_course_to_service";`,
  )
  await knex.raw(
    `ALTER TABLE "_StudyModuleToCourse" RENAME TO "_study_module_to_course";`,
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "_course_to_service" RENAME TO "_CourseToService";`,
  )
  await knex.raw(
    `ALTER TABLE "_study_module_to_course" RENAME TO "_StudyModuleToCourse";`,
  )
}
