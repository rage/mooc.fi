import { Knex } from "knex"
const isProduction = process.env.NODE_ENV === "production"

export async function up(knex: Knex): Promise<void> {
  if (isProduction) {
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS reaktor.completion;`)
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS reaktor."user";`)
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS reaktor.user_course_settings;`)
  }

  await knex.raw(
    `ALTER TABLE "user_course_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "user_course_service_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;`,
  )
  await knex.raw(
    `ALTER TABLE "UserCourseSettings" ALTER COLUMN other TYPE JSON using "other"::json;`,
  )

  await knex.raw(
    `ALTER TABLE "UserCourseSettings" RENAME TO "user_course_setting";`,
  )
  await knex.raw(
    `ALTER TABLE "UserAppDatumConfig" RENAME TO "user_app_datum_config";`,
  )

  if (isProduction) {
    await knex.raw(
      `CREATE materialized VIEW reaktor.user_course_settings AS
        SELECT
            user_id AS "user",
            language,
            country,
            course_variant,
            marketing,
            research,
            other,
            created_at,
            updated_at
        FROM
            "user_course_setting"
        WHERE
            course_id = '55dff8af-c06c-4a97-88e6-af7c04d252ca';
        `,
    )
    await knex.raw(`CREATE INDEX on reaktor.user_course_settings ("user");`)
    await knex.raw(
      `CREATE materialized VIEW reaktor."user" AS
        SELECT
            id,
            upstream_id,
            first_name,
            last_name,
            email,
            created_at,
            updated_at
        FROM
            "user"
        WHERE
            id IN (
                SELECT
                    "user"
                FROM
                    reaktor.user_course_settings
            );
        `,
    )
    await knex.raw(`CREATE INDEX ON reaktor."user" (id);`)
    await knex.raw(`CREATE INDEX ON reaktor."user" (upstream_id);`)
    await knex.raw(
      `CREATE materialized VIEW reaktor.completion AS
        SELECT
            user_id AS "user",
            user_upstream_id,
            email,
            completion_language,
            created_at,
            updated_at
        FROM
            completion
        WHERE
            course_id = '55dff8af-c06c-4a97-88e6-af7c04d252ca';
        `,
    )
    await knex.raw(`CREATE INDEX ON reaktor.completion ("user");`)
    await knex.raw(`CREATE INDEX ON reaktor.completion (user_upstream_id);`)

    await knex.raw(`GRANT SELECT ON ALL TABLES IN SCHEMA reaktor TO reaktor;`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "user_course_setting" RENAME TO "UserCourseSettings";`,
  )
  await knex.raw(
    `ALTER TABLE "user_app_datum_config" RENAME TO "UserAppDatumConfig";`,
  )
}
