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
              'ALTER TABLE "_CourseToService" RENAME TO "_course_to_service";',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "_StudyModuleToCourse" RENAME TO "_study_module_to_course";',
            ),
          ]
        case 2:
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
              'ALTER TABLE "_course_to_service" RENAME TO "_CourseToService";',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "_study_module_to_course" RENAME TO "_StudyModuleToCourse";',
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
//# sourceMappingURL=20200811152243_alter-tables-rename-join-tables.js.map
