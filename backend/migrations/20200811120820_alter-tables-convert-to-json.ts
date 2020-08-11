import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN other TYPE JSON using "other"::json;`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
