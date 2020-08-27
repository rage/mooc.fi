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
          .hasColumn("user", "research_consent")
          .then(function (exists) {
            if (!exists) {
              return knex.schema.alterTable("user", function (table) {
                table.boolean("research_consent")
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
        knex.schema.alterTable("user", function (table) {
          table.dropColumn("research_consent")
        }),
      ]
    })
  })
}
exports.down = down
//# sourceMappingURL=20200626140343_alter-table-user-research_consent.js.map
