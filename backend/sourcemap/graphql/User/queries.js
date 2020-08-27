"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var apollo_server_core_1 = require("apollo-server-core")
var db_functions_1 = require("../../util/db-functions")
var nexus_1 = require("nexus")
var accessControl_1 = require("../../accessControl")
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.crud.users({
      filtering: false,
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("users", {
          type: "user",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
            return ctx.db.user.findMany()
          },
        })*/
    t.field("user", {
      type: "User",
      args: {
        id: nexus_1.schema.idArg(),
        search: nexus_1.schema.stringArg(),
        upstream_id: nexus_1.schema.intArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, search, upstream_id, users
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(id = args.id),
                  (search = args.search),
                  (upstream_id = args.upstream_id)
                if (!id && !search && !upstream_id) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide id, search string or upstream_id",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.user.findMany({
                    where: {
                      OR: db_functions_1.buildSearch(
                        ["first_name", "last_name", "username", "email"],
                        search !== null && search !== void 0 ? search : "",
                      ),
                      id: id !== null && id !== void 0 ? id : undefined,
                      upstream_id:
                        upstream_id !== null && upstream_id !== void 0
                          ? upstream_id
                          : undefined,
                    },
                  }),
                ]
              case 1:
                users = _a.sent()
                if (!users.length)
                  throw new apollo_server_core_1.UserInputError(
                    "User not found",
                  )
                return [2 /*return*/, users[0]]
            }
          })
        })
      },
    })
    t.connection("userDetailsContains", {
      type: "User",
      additionalArgs: {
        search: nexus_1.schema.stringArg(),
        skip: nexus_1.schema.intArg({ default: 0 }),
      },
      authorize: accessControl_1.isAdmin,
      cursorFromNode: function (node, _args, _ctx, _info, _) {
        return "cursor:" + (node === null || node === void 0 ? void 0 : node.id)
      },
      nodes: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var search, first, last, before, after, skip
          return tslib_1.__generator(this, function (_a) {
            ;(search = args.search),
              (first = args.first),
              (last = args.last),
              (before = args.before),
              (after = args.after),
              (skip = args.skip)
            if (
              (!first && !last) ||
              (first !== null && first !== void 0 ? first : 0) > 50 ||
              (last !== null && last !== void 0 ? last : 0) > 50
            ) {
              throw new apollo_server_core_1.ForbiddenError(
                "Cannot query more than 50 objects",
              )
            }
            return [
              2 /*return*/,
              ctx.db.user.findMany(
                tslib_1.__assign(
                  tslib_1.__assign(
                    {},
                    db_functions_1.convertPagination({
                      first: first,
                      last: last,
                      before: before,
                      after: after,
                      skip: skip,
                    }),
                  ),
                  {
                    where: {
                      OR: db_functions_1.buildSearch(
                        ["first_name", "last_name", "username", "email"],
                        search !== null && search !== void 0 ? search : "",
                      ),
                    },
                  },
                ),
              ),
            ]
          })
        })
      },
      extendConnection: function (t) {
        t.int("count", {
          args: {
            search: nexus_1.schema.stringArg(),
          },
          resolve: function (_, _a, ctx) {
            var search = _a.search
            return ctx.db.user.count({
              where: {
                OR: db_functions_1.buildSearch(
                  ["first_name", "last_name", "username", "email"],
                  search !== null && search !== void 0 ? search : "",
                ),
              },
            })
          },
        })
      },
    })
    t.field("currentUser", {
      type: "User",
      nullable: true,
      args: { search: nexus_1.schema.stringArg() },
      resolve: function (_, __, ctx) {
        var _a
        // FIXME: why don't we search anything? where's this come from?
        // const { search } = args
        return (_a = ctx.user) !== null && _a !== void 0 ? _a : null
      },
    })
  },
})
//# sourceMappingURL=queries.js.map
