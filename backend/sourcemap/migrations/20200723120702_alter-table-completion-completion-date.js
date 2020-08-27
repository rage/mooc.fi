"use strict"
exports.__esModule = true
exports.down = exports.up = void 0
var tslib_1 = require("tslib")
function up(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [
        2 /*return*/,
        knex.schema
          .hasColumn("completion", "completion_date")
          .then(function (exists) {
            if (!exists) {
              return knex.schema.alterTable("completion", function (table) {
                table.dateTime("completion_date")
              })
            }
          }),
      ]
    })
  })
}
exports.up = up
function down(knex) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [
        2 /*return*/,
        knex.schema.alterTable("completion", function (table) {
          table.dropColumn("completion_date")
        }),
      ]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200723120702_alter-table-completion-completion-date.js.map
