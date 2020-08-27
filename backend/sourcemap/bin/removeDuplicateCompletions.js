"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var knex_1 = tslib_1.__importDefault(require("../services/knex"))
var removeDuplicateCompletions = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            knex_1["default"].raw(
              "\n        DELETE\n        FROM completion\n        WHERE id IN (SELECT id\n                    FROM completion\n                    WHERE course = '55dff8af-c06c-4a97-88e6-af7c04d252ca'\n                    AND id IN (\n                        SELECT id\n                        FROM (\n                                SELECT id,\n                                        row_number() OVER (\n                                            PARTITION BY \"user\",\n                                                course\n                                            ORDER BY\n                                                created_at\n                                            ) rn\n                                FROM completion\n                            ) s\n                        WHERE rn != 1\n                    ))\n    ",
            ),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
removeDuplicateCompletions()
//# sourceMappingURL=removeDuplicateCompletions.js.map
