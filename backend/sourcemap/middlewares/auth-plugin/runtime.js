"use strict"
exports.__esModule = true
exports.plugin = void 0
var tslib_1 = require("tslib")
var tmc_1 = tslib_1.__importDefault(require("../../services/tmc"))
var redis_1 = require("../../services/redis")
var apollo_server_errors_1 = require("apollo-server-errors")
var accessControl_1 = require("../../accessControl")
var hashUser_1 = tslib_1.__importDefault(require("../../util/hashUser"))
exports.plugin = function (settings) {
  return function (_project) {
    return {
      context: {
        typeGen: {
          fields: {
            details: "any",
            role: "Role",
            user: "any",
            organization: "any",
          },
        },
        create: function (req) {
          return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var rawToken,
              prisma,
              organization,
              details,
              client_1,
              e_1,
              id,
              prismaDetails,
              user
            var _a, _b, _c
            return tslib_1.__generator(this, function (_d) {
              switch (_d.label) {
                case 0:
                  rawToken =
                    (_a =
                      req === null || req === void 0 ? void 0 : req.headers) ===
                      null || _a === void 0
                      ? void 0
                      : _a.authorization
                  if (!rawToken) {
                    return [
                      2 /*return*/,
                      {
                        details: undefined,
                        role: accessControl_1.Role.VISITOR,
                        user: undefined,
                        organization: undefined,
                      },
                    ]
                  }
                  prisma = settings.prisma
                  if (!rawToken.startsWith("Basic")) return [3 /*break*/, 2]
                  return [
                    4 /*yield*/,
                    prisma.organization.findOne({
                      where: {
                        secret_key:
                          (_c =
                            (_b = rawToken.split(" ")) === null || _b === void 0
                              ? void 0
                              : _b[1]) !== null && _c !== void 0
                            ? _c
                            : "",
                      },
                    }),
                  ]
                case 1:
                  organization = _d.sent()
                  if (!organization) {
                    throw new apollo_server_errors_1.AuthenticationError(
                      "log in",
                    )
                  }
                  return [
                    2 /*return*/,
                    {
                      details: undefined,
                      role: accessControl_1.Role.ORGANIZATION,
                      organization: organization,
                      user: undefined,
                    },
                  ]
                case 2:
                  details = null
                  _d.label = 3
                case 3:
                  _d.trys.push([3, 5, , 6])
                  client_1 = new tmc_1["default"](rawToken)
                  return [
                    4 /*yield*/,
                    redis_1.redisify(
                      function () {
                        return tslib_1.__awaiter(
                          void 0,
                          void 0,
                          void 0,
                          function () {
                            return tslib_1.__generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4 /*yield*/,
                                    client_1.getCurrentUserDetails(),
                                  ]
                                case 1:
                                  return [2 /*return*/, _a.sent()]
                              }
                            })
                          },
                        )
                      },
                      {
                        prefix: "userdetails",
                        expireTime: 3600,
                        key: rawToken,
                      },
                    ),
                  ]
                case 4:
                  details = _d.sent()
                  return [3 /*break*/, 6]
                case 5:
                  e_1 = _d.sent()
                  console.log("error", e_1)
                  return [3 /*break*/, 6]
                case 6:
                  if (!details) {
                    throw new apollo_server_errors_1.AuthenticationError(
                      "invalid credentials",
                    )
                  }
                  id = details.id
                  prismaDetails = {
                    upstream_id: id,
                    administrator: details.administrator,
                    email: details.email.trim(),
                    first_name: details.user_field.first_name.trim(),
                    last_name: details.user_field.last_name.trim(),
                    username: details.username,
                  }
                  return [
                    4 /*yield*/,
                    redis_1.redisify(
                      function () {
                        return tslib_1.__awaiter(
                          void 0,
                          void 0,
                          void 0,
                          function () {
                            return tslib_1.__generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4 /*yield*/,
                                    prisma.user.upsert({
                                      where: { upstream_id: id },
                                      create: prismaDetails,
                                      update: prismaDetails,
                                    }),
                                  ]
                                case 1:
                                  return [2 /*return*/, _a.sent()]
                              }
                            })
                          },
                        )
                      },
                      {
                        prefix: "user",
                        expireTime: 3600,
                        key: hashUser_1["default"](prismaDetails),
                      },
                    ),
                  ]
                case 7:
                  user = _d.sent()
                  return [
                    2 /*return*/,
                    {
                      details: details,
                      role: details.administrator
                        ? accessControl_1.Role.ADMIN
                        : accessControl_1.Role.USER,
                      user: user,
                      organization: undefined,
                    },
                  ]
              }
            })
          })
        },
      },
      schema: {
        plugins: [],
      },
    }
  }
}
//# sourceMappingURL=runtime.js.map
