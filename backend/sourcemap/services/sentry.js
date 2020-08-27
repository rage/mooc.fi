"use strict"
exports.__esModule = true
exports.Sentry = void 0
var tslib_1 = require("tslib")
var root_1 = tslib_1.__importDefault(require("../root"))
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var Sentry = tslib_1.__importStar(require("@sentry/node"))
exports.Sentry = Sentry
var integrations_1 = require("@sentry/integrations")
var path = tslib_1.__importStar(require("path"))
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: "moocfi-backend@" + process.env.GIT_COMMIT,
  beforeBreadcrumb: function (breadcrumb, _hint) {
    var _a, _b
    if (breadcrumb.type === "http") {
      if (
        ((_b =
          (_a = breadcrumb.data) === null || _a === void 0
            ? void 0
            : _a.url) !== null && _b !== void 0
          ? _b
          : ""
        ).includes("newrelic.com/agent_listener")
      ) {
        return null
      }
    }
    return breadcrumb
  },
  integrations: [
    new integrations_1.RewriteFrames({
      root: root_1["default"],
      iteratee: function (frame) {
        if (!(frame === null || frame === void 0 ? void 0 : frame.filename))
          return frame
        var filename = path.basename(frame.filename)
        var fileDir = path.dirname(frame.filename)
        var relativePath = path.relative(root_1["default"], fileDir)
        frame.filename = "app:///" + relativePath + "/" + filename
        return frame
      },
    }),
  ],
})
//# sourceMappingURL=sentry.js.map
