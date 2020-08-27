"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var knex_1 = tslib_1.__importDefault(require("../../services/knex"))
var db_functions_1 = require("../../util/db-functions")
var accessControl_1 = require("../../accessControl")
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.list.field("completions", {
      type: "Completion",
      args: {
        course: nexus_1.schema.stringArg({ required: true }),
        completion_language: nexus_1.schema.stringArg(),
        first: nexus_1.schema.intArg(),
        after: nexus_1.schema.idArg(),
        last: nexus_1.schema.intArg(),
        before: nexus_1.schema.idArg(),
      },
      authorize: accessControl_1.or(
        accessControl_1.isOrganization,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var first,
            last,
            completion_language,
            course,
            courseWithSlug,
            courseFromAvoinCourse,
            courseObject
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(first = args.first),
                  (last = args.last),
                  (completion_language = args.completion_language)
                course = args.course
                if (
                  (!first && !last) ||
                  (first !== null && first !== void 0 ? first : 0) > 50 ||
                  (last !== null && last !== void 0 ? last : 0) > 50
                ) {
                  ctx.disableRelations = true
                }
                return [
                  4 /*yield*/,
                  ctx.db.course.findOne({
                    where: {
                      slug: course,
                    },
                  }),
                ]
              case 1:
                courseWithSlug = _a.sent()
                if (!!courseWithSlug) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  ctx.db.courseAlias
                    .findOne({
                      where: {
                        course_code: course,
                      },
                    })
                    .course(),
                ]
              case 2:
                courseFromAvoinCourse = _a.sent()
                if (!courseFromAvoinCourse) {
                  throw new apollo_server_core_1.UserInputError(
                    "Invalid course identifier",
                  )
                }
                course = courseFromAvoinCourse.slug
                _a.label = 3
              case 3:
                return [
                  4 /*yield*/,
                  ctx.db.course.findOne({
                    where: {
                      slug: course,
                    },
                  }),
                ]
              case 4:
                courseObject = _a.sent()
                if (!completion_language) return [3 /*break*/, 6]
                return [
                  4 /*yield*/,
                  knex_1["default"]
                    .select("*")
                    .from("completion")
                    .where({
                      course_id:
                        courseObject === null || courseObject === void 0
                          ? void 0
                          : courseObject.id,
                      completion_language: completion_language,
                    }),
                ]
              case 5:
                return [2 /*return*/, _a.sent()]
              case 6:
                return [
                  4 /*yield*/,
                  knex_1["default"]
                    .select("*")
                    .from("completion")
                    .where({
                      course_id:
                        courseObject === null || courseObject === void 0
                          ? void 0
                          : courseObject.id,
                    }),
                ]
              case 7:
                return [2 /*return*/, _a.sent()]
            }
          })
        })
      },
    })
    t.connection("completionsPaginated", {
      type: "Completion",
      additionalArgs: {
        course: nexus_1.schema.stringArg({ required: true }),
        completion_language: nexus_1.schema.stringArg(),
        skip: nexus_1.schema.intArg({ default: 0 }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isOrganization,
        accessControl_1.isAdmin,
      ),
      cursorFromNode: function (node, _args, _ctx, _info, _) {
        return "cursor:" + (node === null || node === void 0 ? void 0 : node.id)
      },
      nodes: function (_, args, ctx, __) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var completion_language,
            first,
            last,
            before,
            after,
            skip,
            course,
            courseWithSlug,
            courseFromAvoinCourse
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(completion_language = args.completion_language),
                  (first = args.first),
                  (last = args.last),
                  (before = args.before),
                  (after = args.after),
                  (skip = args.skip)
                course = args.course
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
                  4 /*yield*/,
                  ctx.db.course.findOne({
                    where: { slug: course },
                  }),
                ]
              case 1:
                courseWithSlug = _a.sent()
                if (!!courseWithSlug) return [3 /*break*/, 3]
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
                course = courseFromAvoinCourse.slug
                _a.label = 3
              case 3:
                return [
                  2 /*return*/,
                  ctx.db.completion.findMany(
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
                          course: { slug: course },
                          completion_language: completion_language,
                        },
                      },
                    ),
                  ),
                ]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=queries.js.map
