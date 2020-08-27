"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // updated_at
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 1:
          // updated_at
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 3:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 4:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 6:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 7:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 8:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_template" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 9:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 10:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 11:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "image" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 12:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 13:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 14:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 15:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "service" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 16:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 17:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 18:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 19:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 20:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 21:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 22:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 23:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 24:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 25:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
            // id
          ]
        case 26:
          _a.sent()
          // id
          return [
            4 /*yield*/,
            knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
          ]
        case 27:
          // id
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 28:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 29:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 30:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 31:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 32:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 33:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 34:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 35:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_template" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 36:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 37:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 38:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion_required_actions" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 39:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "image" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 40:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 41:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 42:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 43:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "service" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 44:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 45:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 46:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 47:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 48:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 49:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 50:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 51:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 52:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
          ]
        case 53:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();',
            ),
            // created_at not null
          ]
        case 54:
          _a.sent()
          // created_at not null
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 55:
          // created_at not null
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 56:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 57:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 58:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 59:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 60:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 61:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 62:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_template" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 63:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 64:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 65:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "image" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 66:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 67:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 68:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 69:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "service" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 70:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 71:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 72:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 73:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 74:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 75:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 76:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 77:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 78:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
          ]
        case 79:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" ALTER COLUMN "created_at" SET NOT NULL;',
            ),
            // updated_at not null
          ]
        case 80:
          _a.sent()
          // updated_at not null
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 81:
          // updated_at not null
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 82:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 83:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 84:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 85:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 86:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 87:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 88:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_template" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 89:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 90:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 91:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "image" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 92:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 93:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 94:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 95:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "service" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 96:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 97:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 98:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 99:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserAppDatumConfig" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 100:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 101:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 102:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 103:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 104:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 105:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" ALTER COLUMN "updated_at" SET NOT NULL;',
            ),
          ]
        case 106:
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
//# sourceMappingURL=20200811114359_alter-tables-default-values.js.map
