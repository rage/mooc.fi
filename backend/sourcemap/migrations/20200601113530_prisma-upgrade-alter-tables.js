"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
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
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TYPE \"CourseStatus\" AS ENUM ('Active', 'Ended', 'Upcoming');",
            ),
          ]
        case 1:
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
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "CREATE TYPE \"OrganizationRole\" AS ENUM ('OrganizationAdmin', 'Student', 'Teacher');",
            ),
            // note: same as json fields
            /*await knex.raw(
                          `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";`,
                        )
                        await knex.raw(
                          `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::"OrganizationRole";`,
                        )*/
            // defaults
          ]
        case 2:
          _a.sent()
          // note: same as json fields
          /*await knex.raw(
                      `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";`,
                    )
                    await knex.raw(
                      `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::"OrganizationRole";`,
                    )*/
          // defaults
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN automatic_completions SET DEFAULT false;',
            ),
          ]
        case 3:
          // note: same as json fields
          /*await knex.raw(
                      `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";`,
                    )
                    await knex.raw(
                      `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::"OrganizationRole";`,
                    )*/
          // defaults
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN has_certificate SET DEFAULT false;',
            ),
          ]
        case 4:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "ALTER TABLE \"course\" ALTER COLUMN status SET DEFAULT 'Upcoming';",
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN error SET DEFAULT false;',
            ),
          ]
        case 6:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN sent SET DEFAULT false;',
            ),
          ]
        case 7:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN deleted SET DEFAULT false;',
            ),
          ]
        case 8:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN completed SET DEFAULT false;',
            ),
          ]
        case 9:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              "ALTER TABLE \"user_organization\" ALTER COLUMN role SET DEFAULT 'Student';",
            ),
            // created_at defaults
          ]
        case 10:
          _a.sent()
          // created_at defaults
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 11:
          // created_at defaults
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 12:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 13:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 14:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 15:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 16:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 17:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 18:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_template" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 19:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 20:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 21:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "image" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 22:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 23:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 24:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 25:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "service" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 26:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 27:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 28:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 29:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 30:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 31:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 32:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 33:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 34:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 35:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 36:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
exports.up = up
function down(_knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [2 /*return*/]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200601113530_prisma-upgrade-alter-tables.js.map
