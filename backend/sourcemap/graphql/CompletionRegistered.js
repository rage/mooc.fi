"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var lodash_1 = require("lodash")
var accessControl_1 = require("../accessControl")
var apollo_server_core_1 = require("apollo-server-core")
nexus_1.schema.objectType({
  name: "CompletionRegistered",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion_id()
    t.model.course_id()
    t.model.organization_id()
    t.model.real_student_number()
    t.model.user_id()
    t.model.completion()
    t.model.course()
    t.model.organization()
    t.model.user()
  },
})
/************************* QUERIES **********************/
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.list.field("registeredCompletions", {
      type: "CompletionRegistered",
      args: {
        course: nexus_1.schema.stringArg(),
        skip: nexus_1.schema.intArg(),
        take: nexus_1.schema.intArg(),
        cursor: nexus_1.schema.arg({
          type: "CompletionRegisteredWhereUniqueInput",
        }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isOrganization,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course, skip, take, cursor
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(course = args.course),
                  (skip = args.skip),
                  (take = args.take),
                  (cursor = args.cursor)
                if ((take !== null && take !== void 0 ? take : 0) > 50) {
                  throw new apollo_server_core_1.ForbiddenError(
                    "Cannot query more than 50 items",
                  )
                }
                if (!course) return [3 /*break*/, 2]
                return [
                  4 /*yield*/,
                  withCourse(
                    course,
                    skip !== null && skip !== void 0 ? skip : undefined,
                    take !== null && take !== void 0 ? take : undefined,
                    cursor
                      ? {
                          id:
                            (_a = cursor.id) !== null && _a !== void 0
                              ? _a
                              : undefined,
                        }
                      : undefined,
                    ctx,
                  ),
                ]
              case 1:
                return [2 /*return*/, _c.sent()]
              case 2:
                return [
                  4 /*yield*/,
                  all(
                    skip !== null && skip !== void 0 ? skip : undefined,
                    take !== null && take !== void 0 ? take : undefined,
                    cursor
                      ? {
                          id:
                            (_b = cursor.id) !== null && _b !== void 0
                              ? _b
                              : undefined,
                        }
                      : undefined,
                    ctx,
                  ),
                ]
              case 3:
                return [2 /*return*/, _c.sent()]
            }
          })
        })
      },
    })
  },
})
var withCourse = function (course, skip, take, cursor, ctx) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var courseReference, courseFromAvoinCourse
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            ctx.db.course.findOne({
              where: { slug: course },
            }),
          ]
        case 1:
          courseReference = _a.sent()
          if (!!courseReference) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            ctx.db.courseAlias
              .findOne({ where: { course_code: course } })
              .course(),
          ]
        case 2:
          courseFromAvoinCourse = _a.sent()
          if (!courseFromAvoinCourse) {
            throw new apollo_server_core_1.UserInputError(
              "Invalid course identifier",
            )
          }
          return [
            4 /*yield*/,
            ctx.db.course.findOne({
              where: { slug: courseFromAvoinCourse.slug },
            }),
          ]
        case 3:
          // TODO: isn't this the same as courseFromAvoinCourse?
          courseReference = _a.sent()
          _a.label = 4
        case 4:
          return [
            4 /*yield*/,
            ctx.db.completionRegistered.findMany({
              where: {
                course_id: courseReference.id,
              },
              skip: skip,
              take: take,
              cursor: cursor,
            }),
          ]
        case 5:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
var all = function (skip, take, cursor, ctx) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            ctx.db.completionRegistered.findMany({
              skip: skip,
              take: take,
              cursor: cursor,
            }),
          ]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
/************************ MUTATIONS *********************/
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("registerCompletion", {
      type: "String",
      args: {
        completions: nexus_1.schema.arg({ type: "CompletionArg", list: true }),
      },
      authorize: accessControl_1.isOrganization,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var queue, i, promises
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                queue = lodash_1.chunk(args.completions, 500)
                i = 0
                _a.label = 1
              case 1:
                if (!(i < queue.length)) return [3 /*break*/, 4]
                promises = buildPromises(queue[i], ctx)
                return [4 /*yield*/, Promise.all(promises)]
              case 2:
                _a.sent()
                _a.label = 3
              case 3:
                i++
                return [3 /*break*/, 1]
              case 4:
                return [2 /*return*/, "success"]
            }
          })
        })
      },
    })
  },
})
var buildPromises = function (array, ctx) {
  return array.map(function (entry) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var course, user
      var _a
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              ctx.db.completion
                .findOne({ where: { id: entry.completion_id } })
                .course(),
            ]
          case 1:
            course = _b.sent()
            return [
              4 /*yield*/,
              ctx.db.completion
                .findOne({ where: { id: entry.completion_id } })
                .user(),
            ]
          case 2:
            user = _b.sent()
            if (!course || !user) {
              // TODO/FIXME: we now fail silently if course/user not found
              return [2 /*return*/, Promise.resolve()]
            }
            return [
              2 /*return*/,
              ctx.db.completionRegistered.create({
                data: {
                  completion: {
                    connect: { id: entry.completion_id },
                  },
                  organization: {
                    connect: {
                      id:
                        (_a = ctx.organization) === null || _a === void 0
                          ? void 0
                          : _a.id,
                    },
                  },
                  course: { connect: { id: course.id } },
                  real_student_number: entry.student_number,
                  user: { connect: { id: user.id } },
                },
              }),
            ]
        }
      })
    })
  })
}
//# sourceMappingURL=CompletionRegistered.js.map
