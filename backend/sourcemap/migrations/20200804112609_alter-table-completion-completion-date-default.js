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
              'ALTER TABLE "completion" ALTER COLUMN "completion_date" SET DEFAULT CURRENT_TIMESTAMP;',
            ),
          ]
        case 1:
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
//# sourceMappingURL=20200804112609_alter-table-completion-completion-date-default.js.map
