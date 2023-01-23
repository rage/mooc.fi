import { Knex } from "knex"

import { EXTENSION_PATH } from "../config"
import { createExtensions } from "../util/db-functions"

export async function up(knex: Knex): Promise<void> {
  // updated_at
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_alias" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "course_variant" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "email_template" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "image" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "organization_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "service" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )
  await knex.raw(
    `ALTER TABLE "verified_user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;`,
  )

  await createExtensions(knex)

  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "course_alias" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "course_variant" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "email_template" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion_required_actions" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "image" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "organization_translation" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "service" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "study_module" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )
  await knex.raw(
    `ALTER TABLE "verified_user" ALTER COLUMN "id" SET DEFAULT ${EXTENSION_PATH}.uuid_generate_v4();`,
  )

  // created_at not null
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "course" ALTER COLUMN "created_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "course_alias" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_variant" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "email_template" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "image" ALTER COLUMN "created_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "organization" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "organization_translation" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "service" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "created_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "verified_user" ALTER COLUMN "created_at" SET NOT NULL;`,
  )

  // updated_at not null
  await knex.raw(
    `ALTER TABLE "completion" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "completion_registered" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "course" ALTER COLUMN "updated_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "course_alias" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_organization" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_translation" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "course_variant" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "email_delivery" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "email_template" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "exercise_completion" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "image" ALTER COLUMN "updated_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "open_university_registration_link" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "organization" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "organization_translation" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "service" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "study_module_translation" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;`)
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
  await knex.raw(
    `ALTER TABLE "verified_user" ALTER COLUMN "updated_at" SET NOT NULL;`,
  )
}

export async function down(_knex: Knex): Promise<void> {
  return
}
