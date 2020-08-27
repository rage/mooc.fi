"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var winston_sentry_log_1 = tslib_1.__importDefault(
  require("winston-sentry-log"),
)
var winston_1 = tslib_1.__importDefault(require("winston"))
var sentry_1 = require("../../services/sentry")
function logger(_a) {
  var service = _a.service
  var transports = [new winston_1["default"].transports.Console()]
  if (process.env.NODE_ENV === "production") {
    transports.push(
      new winston_sentry_log_1["default"]({
        tags: {
          service: service,
        },
        level: "error",
        sentryClient: sentry_1.Sentry,
        isClientInitialized: true,
        fingerprint: ["{{ default }}", service],
      }),
    )
  }
  return winston_1["default"].createLogger({
    level: "info",
    format: winston_1["default"].format.combine(
      winston_1["default"].format.timestamp(),
      winston_1["default"].format.json(),
    ),
    defaultMeta: { service: service },
    transports: transports,
  })
}
exports["default"] = logger
//# sourceMappingURL=logger.js.map
