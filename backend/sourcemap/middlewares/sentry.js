"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var sentry_1 = require("../services/sentry")
var sentry = function (config) {
  return function (root, args, context, info, next) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var result, error_1
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3])
            return [4 /*yield*/, next(root, args, context, info)]
          case 1:
            result = _a.sent()
            return [2 /*return*/, result]
          case 2:
            error_1 = _a.sent()
            if (process.env.NODE_ENV === "production") {
              sentry_1.Sentry.withScope(function (scope) {
                var _a
                scope.setFingerprint(["{{ default }}", config.fieldConfig.name])
                scope.setExtra("type", config.parentTypeConfig.name)
                scope.setExtra("field", config.fieldConfig.name)
                scope.setExtra("args", args)
                scope.setUser({
                  id:
                    (_a = context.user) === null || _a === void 0
                      ? void 0
                      : _a.id,
                })
                sentry_1.Sentry.captureException(error_1)
              })
            }
            nexus_1.log.error("error", { error: error_1 })
            return [2 /*return*/, error_1]
          case 3:
            return [2 /*return*/]
        }
      })
    })
  }
}
exports["default"] = sentry
//# sourceMappingURL=sentry.js.map
