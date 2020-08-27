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
          .hasColumn("course", "automatic_completions_eligible_for_ects")
          .then(function (exists) {
            if (!exists) {
              return knex.schema.alterTable("course", function (table) {
                table
                  .boolean("automatic_completions_eligible_for_ects")
                  .defaultTo(true)
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
        knex.schema.alterTable("course", function (table) {
          table.dropColumn("automatic_completions_eligible_for_ects")
        }),
      ]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200626141225_alter-table-course-automatic_completions_eligible_for_ects.js.map
