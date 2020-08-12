import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" RENAME TO "user_course_setting";`,
  )
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" RENAME TO "user_app_datum_config";`,
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "user_course_setting" RENAME TO "UserCourseSettings";`,
  )
  await knex.raw(
    `ALTER TABLE "user_app_datum_config" RENAME TO "UserAppDatumConfig";`,
  )
}
