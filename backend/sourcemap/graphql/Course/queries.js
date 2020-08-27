"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../../accessControl")
var db_functions_1 = require("../../util/db-functions")
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("course", {
      type: "Course",
      args: {
        slug: nexus_1.schema.stringArg(),
        id: nexus_1.schema.idArg(),
        language: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.or(
        accessControl_1.isAdmin,
        accessControl_1.isUser,
      ),
      nullable: true,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var slug,
            id,
            language,
            course,
            course_translations,
            _a,
            name_1,
            description,
            _b,
            link
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(slug = args.slug), (id = args.id), (language = args.language)
                if (!slug && !id) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide id or slug",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.course.findOne(
                    tslib_1.__assign(
                      {
                        where: {
                          slug:
                            slug !== null && slug !== void 0 ? slug : undefined,
                          id: id !== null && id !== void 0 ? id : undefined,
                        },
                      },
                      ctx.role !== accessControl_1.Role.ADMIN
                        ? {
                            select: {
                              id: true,
                              slug: true,
                              name: true,
                            },
                          }
                        : {},
                    ),
                  ),
                ]
              case 1:
                course = _c.sent()
                if (!course) {
                  throw new Error("course not found")
                }
                if (!language) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  ctx.db.courseTranslation.findMany({
                    where: {
                      course_id: course.id,
                      language: language,
                    },
                  }),
                ]
              case 2:
                course_translations = _c.sent()
                if (!course_translations.length) {
                  return [2 /*return*/, Promise.resolve(null)]
                }
                ;(_a = course_translations[0]),
                  (name_1 = _a.name),
                  (description = _a.description),
                  (_b = _a.link),
                  (link = _b === void 0 ? "" : _b)
                return [
                  2 /*return*/,
                  tslib_1.__assign(tslib_1.__assign({}, course), {
                    name: name_1,
                    description: description,
                    link: link,
                  }),
                ]
              case 3:
                return [
                  2 /*return*/,
                  tslib_1.__assign(tslib_1.__assign({}, course), {
                    description: "",
                    link: "",
                  }),
                ]
            }
          })
        })
      },
    })
    t.crud.courses({
      ordering: true,
    })
    t.list.field("courses", {
      type: "Course",
      args: {
        orderBy: nexus_1.schema.arg({ type: "CourseOrderByInput" }),
        language: nexus_1.schema.stringArg(),
      },
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var orderBy, language, courses, filtered, _a
          var _this = this
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(orderBy = args.orderBy), (language = args.language)
                return [
                  4 /*yield*/,
                  ctx.db.course.findMany({
                    orderBy:
                      (_b = db_functions_1.filterNull(orderBy)) !== null &&
                      _b !== void 0
                        ? _b
                        : undefined,
                  }),
                ]
              case 1:
                courses = _c.sent()
                if (!language) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  Promise.all(
                    courses.map(function (course) {
                      return tslib_1.__awaiter(
                        _this,
                        void 0,
                        void 0,
                        function () {
                          var course_translations,
                            _a,
                            name,
                            description,
                            _b,
                            link
                          return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                              case 0:
                                return [
                                  4 /*yield*/,
                                  ctx.db.courseTranslation.findMany({
                                    where: {
                                      course_id: course.id,
                                      language: language,
                                    },
                                  }),
                                ]
                              case 1:
                                course_translations = _c.sent()
                                if (!course_translations.length) {
                                  return [2 /*return*/, Promise.resolve(null)]
                                }
                                ;(_a = course_translations[0]),
                                  (name = _a.name),
                                  (description = _a.description),
                                  (_b = _a.link),
                                  (link = _b === void 0 ? "" : _b)
                                return [
                                  2 /*return*/,
                                  tslib_1.__assign(
                                    tslib_1.__assign({}, course),
                                    {
                                      name: name,
                                      description: description,
                                      link: link,
                                    },
                                  ),
                                ]
                            }
                          })
                        },
                      )
                    }),
                  ),
                ]
              case 2:
                _a = _c.sent().filter(function (v) {
                  return !!v
                })
                return [3 /*break*/, 5]
              case 3:
                return [
                  4 /*yield*/,
                  Promise.all(
                    courses.map(function (course) {
                      return tslib_1.__assign(tslib_1.__assign({}, course), {
                        description: "",
                        link: "",
                      })
                    }),
                  ),
                  // TODO: (?) provide proper typing
                ]
              case 4:
                _a = _c.sent()
                _c.label = 5
              case 5:
                filtered = _a
                // TODO: (?) provide proper typing
                return [2 /*return*/, filtered]
            }
          })
        })
      },
    })
    t.field("course_exists", {
      type: "Boolean",
      args: {
        slug: nexus_1.schema.stringArg({ required: true }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isAdmin,
        accessControl_1.isUser,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var slug
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                slug = args.slug
                return [
                  4 /*yield*/,
                  ctx.db.course.findMany({
                    where: { slug: slug },
                    select: { id: true },
                  }),
                ]
              case 1:
                return [2 /*return*/, _a.sent().length > 0]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=queries.js.map
