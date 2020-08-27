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
          .hasColumn("completion", "eligible_for_ects")
          .then(function (exists) {
            if (!exists) {
              return knex.schema.alterTable("completion", function (table) {
                table.boolean("eligible_for_ects").defaultTo(true)
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
          table.dropColumn("eligible_for_ects")
        }),
      ]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200626141004_alter-table-completion-eligible_for_ects.js.map
