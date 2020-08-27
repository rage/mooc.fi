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
          .hasColumn("course", "upcoming_active_link")
          .then(function (exists) {
            if (!exists) {
              return knex.schema.alterTable("course", function (table) {
                table.boolean("upcoming_active_link").defaultTo(false)
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
          table.dropColumn("upcoming_active_link")
        }),
      ]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200818134829_alter-table-course-add-upcoming-active-link.js.map
