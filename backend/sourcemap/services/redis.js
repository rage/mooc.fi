"use strict"
var _a
exports.__esModule = true
exports.invalidate = exports.subscriber = exports.publisher = exports.redisify = exports.getAsync = void 0
var tslib_1 = require("tslib")
var redis = tslib_1.__importStar(require("redis"))
var winston = tslib_1.__importStar(require("winston"))
var util_1 = require("util")
var REDIS_URL =
  (_a = process.env.REDIS_URL) !== null && _a !== void 0
    ? _a
    : "redis://127.0.0.1:7001"
var REDIS_PASSWORD = process.env.REDIS_PASSWORD
var NEXUS_REFLECTION = process.env.NEXUS_REFLECTION
var redisClient = !NEXUS_REFLECTION
  ? redis.createClient({
      url: REDIS_URL,
      password: REDIS_PASSWORD,
    })
  : undefined
var logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})
redisClient === null || redisClient === void 0
  ? void 0
  : redisClient.on("error", function (err) {
      logger.error("Redis error: " + err)
    })
exports.getAsync = redisClient
  ? util_1
      .promisify(
        redisClient === null || redisClient === void 0
          ? void 0
          : redisClient.get,
      )
      .bind(redisClient)
  : function (_) {
      return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
          return [2 /*return*/, Promise.reject()]
        })
      })
    } // this doesn't actually get run ever, but
function redisify(fn, options) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var prefix, expireTime, key, params, prefixedKey
    var _this = this
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ;(prefix = options.prefix),
            (expireTime = options.expireTime),
            (key = options.key),
            (params = options.params)
          if (
            !(redisClient === null || redisClient === void 0
              ? void 0
              : redisClient.connected)
          ) {
            return [
              2 /*return*/,
              fn instanceof Promise ? fn : fn.apply(void 0, params),
            ]
          }
          prefixedKey = prefix + ":" + key
          return [
            4 /*yield*/,
            exports
              .getAsync(prefixedKey)
              .then(function (res) {
                return tslib_1.__awaiter(_this, void 0, void 0, function () {
                  var value, _a, _b
                  return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        if (!res) return [3 /*break*/, 2]
                        logger.info("Cache hit: " + prefix)
                        return [4 /*yield*/, JSON.parse(res)]
                      case 1:
                        return [2 /*return*/, _c.sent()]
                      case 2:
                        logger.info("Cache miss: " + prefix)
                        if (!(fn instanceof Promise)) return [3 /*break*/, 4]
                        return [4 /*yield*/, fn]
                      case 3:
                        _a = _c.sent()
                        return [3 /*break*/, 9]
                      case 4:
                        if (!params) return [3 /*break*/, 6]
                        return [4 /*yield*/, fn.apply(void 0, params)]
                      case 5:
                        _b = _c.sent()
                        return [3 /*break*/, 8]
                      case 6:
                        return [4 /*yield*/, fn()]
                      case 7:
                        _b = _c.sent()
                        _c.label = 8
                      case 8:
                        _a = _b
                        _c.label = 9
                      case 9:
                        value = _a
                        redisClient === null || redisClient === void 0
                          ? void 0
                          : redisClient.set(prefixedKey, JSON.stringify(value))
                        redisClient === null || redisClient === void 0
                          ? void 0
                          : redisClient.expire(prefixedKey, expireTime)
                        return [2 /*return*/, value]
                    }
                  })
                })
              })
              ["catch"](function () {
                return fn instanceof Promise
                  ? fn
                  : params
                  ? fn.apply(void 0, params)
                  : fn()
              }),
          ]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
exports.redisify = redisify
exports.publisher = !NEXUS_REFLECTION
  ? redis.createClient({
      url: REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })
  : null
exports.subscriber = !NEXUS_REFLECTION
  ? redis.createClient({
      url: REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })
  : null
exports.invalidate = function (prefix, key) {
  if (
    !(redisClient === null || redisClient === void 0
      ? void 0
      : redisClient.connected)
  ) {
    return
  }
  redisClient.del(prefix + ":" + key)
}
exports["default"] = redisClient
//# sourceMappingURL=redis.js.map
