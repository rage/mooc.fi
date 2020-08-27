"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
var isProduction = process.env.NODE_ENV === "production"
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!isProduction) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            knex.raw("DROP MATERIALIZED VIEW reaktor.completion;"),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('DROP MATERIALIZED VIEW reaktor."user";'),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw("DROP MATERIALIZED VIEW reaktor.user_course_settings;"),
          ]
        case 3:
          _a.sent()
          _a.label = 4
        case 4:
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;',
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN progress TYPE JSON USING "progress"::json;',
            ),
          ]
        case 6:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN other TYPE JSON using "other"::json;',
            ),
          ]
        case 7:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" RENAME TO "user_course_setting";',
            ),
          ]
        case 8:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" RENAME TO "user_app_datum_config";',
            ),
          ]
        case 9:
          _a.sent()
          if (!isProduction) return [3 /*break*/, 19]
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE materialized VIEW reaktor.user_course_settings AS\n        SELECT\n            user_id AS "user",\n            language,\n            country,\n            course_variant,\n            marketing,\n            research,\n            other,\n            created_at,\n            updated_at\n        FROM\n            "user_course_setting"\n        WHERE\n            course_id = \'55dff8af-c06c-4a97-88e6-af7c04d252ca\';\n        ',
            ),
          ]
        case 10:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('CREATE INDEX on reaktor.user_course_settings ("user");'),
          ]
        case 11:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'CREATE materialized VIEW reaktor."user" AS\n        SELECT\n            id,\n            upstream_id,\n            first_name,\n            last_name,\n            email,\n            created_at,\n            updated_at\n        FROM\n            "user"\n        WHERE\n            id IN (\n                SELECT\n                    "user"\n                FROM\n                    reaktor.user_course_settings\n            );\n        ',
            ),
          ]
        case 12:
          _a.sent()
          return [4 /*yield*/, knex.raw('CREATE INDEX ON reaktor."user" (id);')]
        case 13:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('CREATE INDEX ON reaktor."user" (upstream_id);'),
          ]
        case 14:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE materialized VIEW reaktor.completion AS\n        SELECT\n            user_id AS \"user\",\n            user_upstream_id,\n            email,\n            completion_language,\n            created_at,\n            updated_at\n        FROM\n            completion\n        WHERE\n            course_id = '55dff8af-c06c-4a97-88e6-af7c04d252ca';\n        ",
            ),
          ]
        case 15:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('CREATE INDEX ON reaktor.completion ("user");'),
          ]
        case 16:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw("CREATE INDEX ON reaktor.completion (user_upstream_id);"),
          ]
        case 17:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "GRANT SELECT ON ALL TABLES IN SCHEMA reaktor TO reaktor;",
            ),
          ]
        case 18:
          _a.sent()
          _a.label = 19
        case 19:
          return [2 /*return*/]
      }
    })
  })
}
exports.up = up
function down(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_setting" RENAME TO "UserCourseSettings";',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_app_datum_config" RENAME TO "UserAppDatumConfig";',
            ),
          ]
        case 2:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
exports.down = down
//# sourceMappingURL=20200813150438_alter-tables-convert-to-json-rename-camelcase-drop-recreate-view.js.map
