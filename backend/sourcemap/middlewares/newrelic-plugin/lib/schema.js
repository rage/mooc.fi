"use strict"
exports.__esModule = true
exports.newrelicPlugin = void 0
var tslib_1 = require("tslib")
var schema_1 = require("@nexus/schema")
var newrelic = require("newrelic")
function newrelicPlugin() {
  return schema_1.plugin({
    name: "New Relic Plugin",
    onCreateFieldResolver: function (config) {
      var _this = this
      return function (root, args, ctx, info, next) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var result, error_1
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2, , 4])
                if (!root) {
                  newrelic.setTransactionName(
                    "graphql/" +
                      config.parentTypeConfig.name +
                      "." +
                      config.fieldConfig.name,
                  )
                }
                return [4 /*yield*/, next(root, args, ctx, info)]
              case 1:
                result = _a.sent()
                return [2 /*return*/, result]
              case 2:
                error_1 = _a.sent()
                newrelic.noticeError(error_1)
                return [4 /*yield*/, next(root, args, ctx, info)]
              case 3:
                return [2 /*return*/, _a.sent()]
              case 4:
                return [2 /*return*/]
            }
          })
        })
      }
    },
  })
}
exports.newrelicPlugin = newrelicPlugin
//# sourceMappingURL=schema.js.map
