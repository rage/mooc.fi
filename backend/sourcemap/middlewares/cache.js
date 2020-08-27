"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var crypto_1 = require("crypto")
var redis_1 = require("../services/redis")
// import { NexusContext } from "../context"
var cache = function (_config) {
  return function (root, args, context, info, next) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var rawToken, key, hash, res
      var _a
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            rawToken = undefined
            if (context.headers) {
              rawToken =
                (_a =
                  context === null || context === void 0
                    ? void 0
                    : context.headers) === null || _a === void 0
                  ? void 0
                  : _a.authorization
            } /* else if (context.connection) {
                  rawToken = context.connection.context["Authorization"]
                }*/
            if (!(root || info.parentType.toString() !== "Query" || rawToken))
              return [3 /*break*/, 2]
            return [4 /*yield*/, next(root, args, context, info)]
          case 1:
            return [2 /*return*/, _b.sent()]
          case 2:
            key =
              info.fieldName +
              "-" +
              JSON.stringify(info.fieldNodes) +
              "-" +
              JSON.stringify(args)
            hash = crypto_1.createHash("sha512").update(key).digest("hex")
            return [
              4 /*yield*/,
              redis_1.redisify(
                function () {
                  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, next(root, args, context, info)]
                        case 1:
                          return [2 /*return*/, _a.sent()]
                      }
                    })
                  })
                },
                {
                  prefix: "graphql-response",
                  expireTime: 300,
                  key: hash,
                },
              ),
            ]
          case 3:
            res = _b.sent()
            return [2 /*return*/, res]
        }
      })
    })
  }
}
exports["default"] = cache
//# sourceMappingURL=cache.js.map
