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
              'ALTER TABLE "course" ALTER COLUMN "status" DROP DEFAULT;',
            ),
          ]
        case 1:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::text::"CourseStatus";',
            ),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "course" ALTER COLUMN "status" SET DEFAULT \'Upcoming\';',
            ),
          ]
        case 3:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "role" DROP DEFAULT;',
            ),
          ]
        case 4:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::text::"OrganizationRole";',
            ),
          ]
        case 5:
          _a.sent()
          return [
            4 /*yield*/,
            knex.raw(
              'ALTER TABLE "user_organization" ALTER COLUMN "role" SET DEFAULT \'Student\';',
            ),
          ]
        case 6:
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
//# sourceMappingURL=20200811120715_alter-tables-convert-to-enums.js.map
