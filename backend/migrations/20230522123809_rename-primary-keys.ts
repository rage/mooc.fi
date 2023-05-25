import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER INDEX "UserAppDatumConfig_pkey"
      RENAME TO "user_app_datum_config_pkey";
  `)
  await knex.raw(`
    ALTER INDEX "UserCourseSettings_pkey"
      RENAME TO "user_course_setting_pkey";
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER INDEX "user_app_datum_config_pkey"
      RENAME TO "UserAppDatumConfig_pkey";
  `)
  await knex.raw(`
    ALTER INDEX "user_course_setting_pkey"
      RENAME TO "UserCourseSettings_pkey";
  `)
}
