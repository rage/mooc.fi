"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion" RENAME "course" TO "course_id";',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "completion" RENAME "user" to "user_id";'),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "completion" TO "completion_id";',
            ),
          ]
        case 3:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "course" TO "course_id";',
            ),
          ]
        case 4:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "organization" TO "organization_id";',
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "user" TO "user_id";',
            ),
          ]
        case 6:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "completion_email" TO "completion_email_id";',
            ),
          ]
        case 7:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "completions_handled_by" TO "completions_handled_by_id";',
            ),
          ]
        case 8:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "inherit_settings_from" TO "inherit_settings_from_id";',
            ),
          ]
        case 9:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "owner_organization" TO "owner_organization_id";',
            ),
          ]
        case 10:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "course" RENAME "photo" TO "photo_id";'),
          ]
        case 11:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" RENAME "course" TO "course_id";',
            ),
          ]
        case 12:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" RENAME "course" TO "course_id";',
            ),
          ]
        case 13:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" RENAME "organization" TO "organization_id";',
            ),
          ]
        case 14:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" RENAME "course" TO "course_id";',
            ),
          ]
        case 15:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" RENAME "course" TO "course_id";',
            ),
          ]
        case 16:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" RENAME "email_template" TO "email_template_id";',
            ),
          ]
        case 17:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" RENAME "user" TO "user_id";',
            ),
          ]
        case 18:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "exercise" RENAME "course" TO "course_id";'),
          ]
        case 19:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" RENAME "service" TO "service_id";',
            ),
          ]
        case 20:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" RENAME "exercise" TO "exercise_id";',
            ),
          ]
        case 21:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" RENAME "user" to "user_id";',
            ),
          ]
        case 22:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion_required_actions" RENAME "exercise_completion" TO "exercise_completion_id";',
            ),
          ]
        case 23:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" RENAME "course" TO "course_id";',
            ),
          ]
        case 24:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" RENAME "creator" TO "creator_id";',
            ),
          ]
        case 25:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" RENAME "organization" TO "organization_id";',
            ),
          ]
        case 26:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" RENAME "study_module" TO "study_module_id";',
            ),
          ]
        case 27:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" RENAME "course" TO "course_id";',
            ),
          ]
        case 28:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" RENAME "user" TO "user_id";',
            ),
          ]
        case 29:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "course" TO "course_id";',
            ),
          ]
        case 30:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "service" TO "service_id";',
            ),
          ]
        case 31:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "user" TO "user_id";',
            ),
          ]
        case 32:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "user_course_progress" TO "user_course_progress_id";',
            ),
          ]
        case 33:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" RENAME "course" TO "course_id";',
            ),
          ]
        case 34:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" RENAME "user" TO "user_id";',
            ),
          ]
        case 35:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" RENAME "course" TO "course_id";',
            ),
          ]
        case 36:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" RENAME "organization" TO "organization_id";',
            ),
          ]
        case 37:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" RENAME "user" TO "user_id";',
            ),
          ]
        case 38:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" RENAME "organization" TO "organization_id";',
            ),
          ]
        case 39:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "verified_user" RENAME "user" TO "user_id";'),
          ]
        case 40:
          _a.sent()
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
              'ALTER TABLE "completion" RENAME "course_id" TO "course";',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "completion" RENAME "user_id" TO "user";'),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "completion_id" TO "completion";',
            ),
          ]
        case 3:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "course_id" TO "course";',
            ),
          ]
        case 4:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "organization_id" TO "organization";',
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "completion_registered" RENAME "user_id" TO "user";',
            ),
          ]
        case 6:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "completion_email_id" TO "completion_email";',
            ),
          ]
        case 7:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "completions_handled_by_id" TO "completions_handled_by";',
            ),
          ]
        case 8:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "inherit_settings_from_id" TO "inherit_settings_from";',
            ),
          ]
        case 9:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" RENAME "owner_organization_id" TO "owner_organization";',
            ),
          ]
        case 10:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "course" RENAME "photo_id" TO "photo";'),
          ]
        case 11:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_alias" RENAME "course_id" TO "course";',
            ),
          ]
        case 12:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" RENAME "course_id" TO "course";',
            ),
          ]
        case 13:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_organization" RENAME "organization_id" TO "organization";',
            ),
          ]
        case 14:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_translation" RENAME "course_id" TO "course";',
            ),
          ]
        case 15:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course_variant" RENAME "course_id" TO "course";',
            ),
          ]
        case 16:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" RENAME "email_template_id" TO "email_template";',
            ),
          ]
        case 17:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "email_delivery" RENAME "user_id" TO "user";',
            ),
          ]
        case 18:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "exercise" RENAME "course_id" TO "course";'),
          ]
        case 19:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise" RENAME "service_id" TO "service";',
            ),
          ]
        case 20:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" RENAME "exercise_id" TO "exercise";',
            ),
          ]
        case 21:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion" RENAME "user_id" TO "user";',
            ),
          ]
        case 22:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "exercise_completion_required_actions" RENAME "exercise_completion_id" TO "exercise_completion";',
            ),
          ]
        case 23:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "open_university_registration_link" RENAME "course_id" TO "course";',
            ),
          ]
        case 24:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization" RENAME "creator_id" TO "creator";',
            ),
          ]
        case 25:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "organization_translation" RENAME "organization_id" TO "organization";',
            ),
          ]
        case 26:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "study_module_translation" RENAME "study_module_id" TO "study_module";',
            ),
          ]
        case 27:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" RENAME "course_id" TO "course";',
            ),
          ]
        case 28:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_progress" RENAME "user_id" TO "user";',
            ),
          ]
        case 29:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "course_id" TO "course";',
            ),
          ]
        case 30:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "service_id" TO "service";',
            ),
          ]
        case 31:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "user_id" TO "user";',
            ),
          ]
        case 32:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_service_progress" RENAME "user_course_progress_id" TO "user_course_progress";',
            ),
          ]
        case 33:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" RENAME "course_id" TO "course";',
            ),
          ]
        case 34:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "UserCourseSettings" RENAME "user_id" TO "user";',
            ),
          ]
        case 35:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_course_settings_visibility" RENAME "course_id" TO "course";',
            ),
          ]
        case 36:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" RENAME "organization_id" TO "organization";',
            ),
          ]
        case 37:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" RENAME "user_id" TO "user";',
            ),
          ]
        case 38:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "verified_user" RENAME "organization_id" TO "organization";',
            ),
          ]
        case 39:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw('ALTER TABLE "verified_user" RENAME "user_id" TO "user";'),
          ]
        case 40:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
exports.down = down
//# sourceMappingURL=20200810142948_alter-tables-foreign-key-fields.js.map
