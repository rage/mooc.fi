"use strict"
exports.__esModule = true
exports.contextUser = void 0
var tslib_1 = require("tslib")
var apollo_server_core_1 = require("apollo-server-core")
var tmc_1 = tslib_1.__importDefault(require("../services/tmc"))
var accessControl_1 = require("../accessControl")
var redis_1 = require("../services/redis")
// this is the version suitable for middleware, not used for now
var fetchUser = function (_config) {
  return function (root, args, ctx, info, next) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var rawToken
      var _a
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!(ctx.userDetails || ctx.organization)) return [3 /*break*/, 2]
            return [4 /*yield*/, next(root, args, ctx, info)]
          case 1:
            return [2 /*return*/, _b.sent()]
          case 2:
            rawToken =
              (_a = ctx.headers) === null || _a === void 0
                ? void 0
                : _a.authorization // connection?
            if (!!rawToken) return [3 /*break*/, 3]
            ctx.role = accessControl_1.Role.VISITOR
            return [3 /*break*/, 7]
          case 3:
            if (!rawToken.startsWith("Basic")) return [3 /*break*/, 5]
            return [4 /*yield*/, getOrganization(ctx, rawToken)]
          case 4:
            _b.sent()
            return [3 /*break*/, 7]
          case 5:
            return [4 /*yield*/, getUser(ctx, rawToken)]
          case 6:
            _b.sent()
            _b.label = 7
          case 7:
            return [4 /*yield*/, next(root, args, ctx, info)]
          case 8:
            return [2 /*return*/, _b.sent()]
        }
      })
    })
  }
}
var getOrganization = function (ctx, rawToken) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var secret, org
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          secret =
            (_a =
              rawToken === null || rawToken === void 0
                ? void 0
                : rawToken.split(" ")[1]) !== null && _a !== void 0
              ? _a
              : ""
          return [
            4 /*yield*/,
            ctx.db.organization.findMany({
              where: { secret_key: secret },
            }),
          ]
        case 1:
          org = _b.sent()
          if (org.length < 1) {
            throw new apollo_server_core_1.AuthenticationError("Please log in.")
          }
          ctx.organization = org[0]
          ctx.role = accessControl_1.Role.ORGANIZATION
          return [2 /*return*/]
      }
    })
  })
}
var getUser = function (ctx, rawToken) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var client, details, e_1, id, prismaDetails, _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          client = new tmc_1["default"](rawToken)
          details = null
          _b.label = 1
        case 1:
          _b.trys.push([1, 3, , 4])
          return [
            4 /*yield*/,
            redis_1.redisify(client.getCurrentUserDetails(), {
              prefix: "userdetails",
              expireTime: 3600,
              key: rawToken,
            }),
          ]
        case 2:
          details = _b.sent()
          return [3 /*break*/, 4]
        case 3:
          e_1 = _b.sent()
          console.log("error", e_1)
          return [3 /*break*/, 4]
        case 4:
          ctx.tmcClient = client
          ctx.userDetails =
            details !== null && details !== void 0 ? details : undefined
          if (!details) {
            return [2 /*return*/]
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
          _a = ctx
          return [
            4 /*yield*/,
            ctx.db.user.upsert({
              where: { upstream_id: id },
              create: prismaDetails,
              update: prismaDetails,
            }),
          ]
        case 5:
          _a.user = _b.sent()
          if (ctx.user.administrator) {
            ctx.role = accessControl_1.Role.ADMIN
          } else {
            ctx.role = accessControl_1.Role.USER
          }
          return [2 /*return*/]
      }
    })
  })
}
exports["default"] = fetchUser
// this is the one suitable for context, not use for now
exports.contextUser = function (
  req, // was: IncomingMessage, but somehow it's wrapped in req
  prisma,
) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var rawToken, organization, details, client_1, e_2, id, prismaDetails, user
    var _a, _b, _c
    return tslib_1.__generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          rawToken =
            (_a = req === null || req === void 0 ? void 0 : req.headers) ===
              null || _a === void 0
              ? void 0
              : _a.authorization
          if (!rawToken) {
            return [
              2 /*return*/,
              {
                role: accessControl_1.Role.VISITOR,
                user: undefined,
                organization: undefined,
              },
            ]
          }
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
            throw new apollo_server_core_1.AuthenticationError("log in")
          }
          return [
            2 /*return*/,
            {
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
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                  return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, client_1.getCurrentUserDetails()]
                      case 1:
                        return [2 /*return*/, _a.sent()]
                    }
                  })
                })
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
          e_2 = _d.sent()
          console.log("error", e_2)
          return [3 /*break*/, 6]
        case 6:
          if (!details) {
            throw new apollo_server_core_1.AuthenticationError(
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
            prisma.user.upsert({
              where: { upstream_id: id },
              create: prismaDetails,
              update: prismaDetails,
            }),
          ]
        case 7:
          user = _d.sent()
          return [
            2 /*return*/,
            {
              role: details.administrator
                ? accessControl_1.Role.ADMIN
                : accessControl_1.Role.USER,
              organization: undefined,
              user: user,
            },
          ]
      }
    })
  })
}
//# sourceMappingURL=FetchUser.js.map
