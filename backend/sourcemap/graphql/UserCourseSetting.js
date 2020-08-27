"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var db_functions_1 = require("../util/db-functions")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "UserCourseSetting",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.country()
    t.model.course_id()
    t.model.course()
    t.model.course_variant()
    t.model.language()
    t.model.marketing()
    t.model.other()
    t.model.research()
    t.model.user_id()
    t.model.user()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("userCourseSetting", {
      type: "UserCourseSetting",
      args: {
        user_id: nexus_1.schema.idArg({ required: true }),
        course_id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_id, course_id, inheritSettingsCourse, result
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                user_id = args.user_id
                course_id = args.course_id
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { id: course_id } })
                    .inherit_settings_from(),
                ]
              case 1:
                inheritSettingsCourse = _a.sent()
                if (inheritSettingsCourse) {
                  course_id = inheritSettingsCourse.id
                }
                return [
                  4 /*yield*/,
                  ctx.db.userCourseSetting.findMany({
                    where: {
                      user_id: user_id,
                      course_id: course_id,
                    },
                  }),
                ]
              case 2:
                result = _a.sent()
                if (!result.length) {
                  throw new apollo_server_core_1.UserInputError("Not found")
                }
                return [2 /*return*/, result[0]]
            }
          })
        })
      },
    })
    t.field("userCourseSettingCount", {
      type: "Int",
      args: {
        user_id: nexus_1.schema.idArg(),
        course_id: nexus_1.schema.idArg(),
      },
      resolve: function (_, args, ctx) {
        var user_id = args.user_id,
          course_id = args.course_id
        return ctx.db.userCourseSetting.count({
          where: {
            user_id: user_id,
            course_id: course_id,
          },
        })
      },
    })
    t.connection("userCourseSettings", {
      type: "UserCourseSetting",
      additionalArgs: {
        user_id: nexus_1.schema.idArg(),
        user_upstream_id: nexus_1.schema.intArg(),
        course_id: nexus_1.schema.idArg(),
        search: nexus_1.schema.stringArg(),
        skip: nexus_1.schema.intArg({ default: 0 }),
      },
      authorize: accessControl_1.isAdmin,
      nodes: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var first,
            last,
            before,
            after,
            user_id,
            user_upstream_id,
            search,
            skip,
            course_id,
            inheritSettingsCourse,
            orCondition
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(first = args.first),
                  (last = args.last),
                  (before = args.before),
                  (after = args.after),
                  (user_id = args.user_id),
                  (user_upstream_id = args.user_upstream_id),
                  (search = args.search),
                  (skip = args.skip)
                course_id = args.course_id
                if (
                  (!first && !last) ||
                  (first !== null && first !== void 0 ? first : 0) > 50 ||
                  (last !== null && last !== void 0 ? last : 0) > 50
                ) {
                  throw new apollo_server_core_1.ForbiddenError(
                    "Cannot query more than 50 objects",
                  )
                }
                if (!course_id) return [3 /*break*/, 2]
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { id: course_id } })
                    .inherit_settings_from(),
                ]
              case 1:
                inheritSettingsCourse = _a.sent()
                if (inheritSettingsCourse) {
                  course_id = inheritSettingsCourse.id
                }
                _a.label = 2
              case 2:
                orCondition = [
                  {
                    OR: db_functions_1.buildSearch(
                      ["first_name", "last_name", "username", "email"],
                      search !== null && search !== void 0 ? search : "",
                    ),
                  },
                ]
                if (user_id) orCondition.concat({ id: user_id })
                if (user_upstream_id)
                  orCondition.concat({ upstream_id: user_upstream_id })
                return [
                  2 /*return*/,
                  ctx.db.userCourseSetting.findMany(
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
                          user: {
                            OR: orCondition,
                          },
                          course_id: course_id,
                        },
                      },
                    ),
                  ),
                ]
            }
          })
        })
      },
      extendConnection: function (t) {
        var _this = this
        t.int("count", {
          args: {
            user_id: nexus_1.schema.idArg(),
            user_upstream_id: nexus_1.schema.intArg(),
            course_id: nexus_1.schema.idArg({ required: true }),
            search: nexus_1.schema.stringArg(),
          },
          resolve: function (_, args, ctx) {
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
              var user_id,
                user_upstream_id,
                search,
                course_id,
                inheritSettingsCourse,
                orCondition,
                count
              return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    ;(user_id = args.user_id),
                      (user_upstream_id = args.user_upstream_id),
                      (search = args.search)
                    course_id = args.course_id
                    return [
                      4 /*yield*/,
                      ctx.db.course
                        .findOne({ where: { id: course_id } })
                        .inherit_settings_from(),
                    ]
                  case 1:
                    inheritSettingsCourse = _a.sent()
                    if (inheritSettingsCourse) {
                      course_id = inheritSettingsCourse.id
                    }
                    orCondition = [
                      {
                        OR: db_functions_1.buildSearch(
                          ["first_name", "last_name", "username", "email"],
                          search !== null && search !== void 0 ? search : "",
                        ),
                      },
                    ]
                    if (user_id) orCondition.concat({ id: user_id })
                    if (user_upstream_id)
                      orCondition.concat({ upstream_id: user_upstream_id })
                    return [
                      4 /*yield*/,
                      ctx.db.userCourseSetting.count({
                        where: {
                          user: {
                            OR: orCondition,
                          },
                          course_id: course_id,
                        },
                      }),
                    ]
                  case 2:
                    count = _a.sent()
                    return [2 /*return*/, count]
                }
              })
            })
          },
        })
      },
    })
  },
})
//# sourceMappingURL=UserCourseSetting.js.map
