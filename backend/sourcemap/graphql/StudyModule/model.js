"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var notEmpty_1 = require("../../util/notEmpty")
var db_functions_1 = require("../../util/db-functions")
nexus_1.schema.objectType({
  name: "StudyModule",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.created_at()
    t.model.image()
    t.model.name()
    t.model.order()
    t.model.slug()
    t.model.updated_at()
    t.model.study_module_translations()
    // t.prismaFields(["*"])
    t.field("description", { type: "String" })
    t.list.field("courses", {
      type: "Course",
      args: {
        orderBy: nexus_1.schema.arg({ type: "CourseOrderByInput" }),
        language: nexus_1.schema.stringArg(),
      },
      resolve: function (parent, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var language, orderBy, courses, values, _a
          var _this = this
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(language = args.language), (orderBy = args.orderBy)
                return [
                  4 /*yield*/,
                  ctx.db.course.findMany({
                    orderBy:
                      (_b = db_functions_1.filterNull(orderBy)) !== null &&
                      _b !== void 0
                        ? _b
                        : undefined,
                    where: { study_modules: { some: { id: parent.id } } },
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
                _a = _c.sent().filter(notEmpty_1.notEmpty)
                return [3 /*break*/, 4]
              case 3:
                _a = courses.map(function (course) {
                  return tslib_1.__assign(tslib_1.__assign({}, course), {
                    description: "",
                    link: "",
                  })
                })
                _c.label = 4
              case 4:
                values = _a
                return [2 /*return*/, values]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=model.js.map
