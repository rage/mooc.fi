import { Knex } from "knex"

export async function up(knex: Knex): Promise<any> {
  // JSON fields
  // note: the old backend doesn't work properly if these are altered -
  // the new one doesn't really care, so best not change them until the old one is not in use anymore
  /*await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN other TYPE JSON using "other"::json;`,
  )*/

  // enums
  await knex.raw(
    `CREATE TYPE "CourseStatus" AS ENUM ('Active', 'Ended', 'Upcoming');`,
  )
  await knex.raw(
    `CREATE TYPE "OrganizationRole" AS ENUM ('OrganizationAdmin', 'Student', 'Teacher');`,
  )

  // note: same as json fields

  /*await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::"OrganizationRole";`,
  )*/

  // defaults
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN automatic_completions SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN has_certificate SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN status SET DEFAULT 'Upcoming';`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN error SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN sent SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN deleted SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN completed SET DEFAULT false;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN role SET DEFAULT 'Student';`,
  )

  // created_at defaults
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_alias" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_variant" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "email_template" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "image" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "organization_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "service" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "verified_user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
}

export async function down(_knex: Knex): Promise<any> {
  return
}
