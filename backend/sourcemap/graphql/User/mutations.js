"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var apollo_server_core_1 = require("apollo-server-core")
var redis_1 = require("../../services/redis")
var nexus_1 = require("nexus")
var hashUser_1 = tslib_1.__importDefault(require("../../util/hashUser"))
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("updateUserName", {
      type: "User",
      args: {
        first_name: nexus_1.schema.stringArg(),
        last_name: nexus_1.schema.stringArg(),
      },
      resolve: function (_, _a, ctx) {
        var first_name = _a.first_name,
          last_name = _a.last_name
        var currentUser = ctx.user,
          authorization = ctx.headers.authorization
        if (!currentUser) {
          throw new apollo_server_core_1.AuthenticationError("not logged in")
        }
        var access_token =
          authorization === null || authorization === void 0
            ? void 0
            : authorization.split(" ")[1]
        redis_1.invalidate("userdetails", "Bearer " + access_token)
        redis_1.invalidate("user", hashUser_1["default"](currentUser))
        return ctx.db.user.update({
          where: { id: currentUser.id },
          data: {
            first_name: first_name,
            last_name: last_name,
          },
        })
      },
    })
    t.field("updateResearchConsent", {
      type: "User",
      args: {
        value: nexus_1.schema.booleanArg({ required: true }),
      },
      resolve: function (_, _a, ctx) {
        var value = _a.value
        var currentUser = ctx.user,
          authorization = ctx.headers.authorization
        if (!currentUser) {
          throw new apollo_server_core_1.AuthenticationError("not logged in")
        }
        var access_token =
          authorization === null || authorization === void 0
            ? void 0
            : authorization.split(" ")[1]
        redis_1.invalidate("userdetails", "Bearer " + access_token)
        redis_1.invalidate("user", hashUser_1["default"](currentUser))
        return ctx.db.user.update({
          where: { id: currentUser.id },
          data: {
            research_consent: value,
          },
        })
      },
    })
    t.field("addUser", {
      type: "User",
      args: {
        user: nexus_1.schema.arg({
          type: "UserArg",
          required: true,
        }),
      },
      resolve: function (_, _a, ctx) {
        var user = _a.user
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var exists
          return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.user.findMany({
                    where: { upstream_id: user.upstream_id },
                  }),
                ]
              case 1:
                exists = _b.sent()
                if (exists.length > 0) {
                  throw new Error("user with that upstream id already exists")
                }
                return [
                  2 /*return*/,
                  ctx.db.user.create({
                    data: tslib_1.__assign(tslib_1.__assign({}, user), {
                      administrator: false,
                    }),
                  }),
                ]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=mutations.js.map
