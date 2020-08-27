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
    t.field("study_module", {
      type: "StudyModule",
      args: {
        id: nexus_1.schema.idArg(),
        slug: nexus_1.schema.stringArg(),
        language: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.or(
        accessControl_1.isAdmin,
        accessControl_1.isUser,
      ),
      nullable: true,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id,
            slug,
            language,
            study_module,
            module_translations,
            _a,
            name_1,
            _b,
            description
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(id = args.id), (slug = args.slug), (language = args.language)
                if (!id && !slug) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide id or slug",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.studyModule.findOne(
                    tslib_1.__assign(
                      {
                        where: {
                          id: id !== null && id !== void 0 ? id : undefined,
                          slug:
                            slug !== null && slug !== void 0 ? slug : undefined,
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
                study_module = _c.sent()
                if (!study_module) {
                  throw new Error("study module not found")
                }
                if (!language) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  ctx.db.studyModuleTranslation.findMany({
                    where: {
                      study_module_id: study_module.id,
                      language: language,
                    },
                  }),
                ]
              case 2:
                module_translations = _c.sent()
                if (!module_translations.length) {
                  return [2 /*return*/, Promise.resolve(null)]
                }
                ;(_a = module_translations[0]),
                  (name_1 = _a.name),
                  (_b = _a.description),
                  (description = _b === void 0 ? "" : _b)
                return [
                  2 /*return*/,
                  tslib_1.__assign(tslib_1.__assign({}, study_module), {
                    name: name_1,
                    description: description,
                  }),
                ]
              case 3:
                return [
                  2 /*return*/,
                  tslib_1.__assign(tslib_1.__assign({}, study_module), {
                    description: "",
                  }),
                ]
            }
          })
        })
      },
    })
    t.crud.studyModules({
      alias: "study_modules",
      ordering: true,
    })
    t.list.field("study_modules", {
      type: "StudyModule",
      args: {
        orderBy: nexus_1.schema.arg({ type: "StudyModuleOrderByInput" }),
        language: nexus_1.schema.stringArg(),
      },
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var orderBy, language, modules, filtered, _a
          var _this = this
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(orderBy = args.orderBy), (language = args.language)
                return [
                  4 /*yield*/,
                  ctx.db.studyModule.findMany({
                    orderBy:
                      (_b = db_functions_1.filterNull(orderBy)) !== null &&
                      _b !== void 0
                        ? _b
                        : undefined,
                  }),
                ]
              case 1:
                modules = _c.sent()
                if (!language) return [3 /*break*/, 3]
                return [
                  4 /*yield*/,
                  Promise.all(
                    modules.map(function (module) {
                      return tslib_1.__awaiter(
                        _this,
                        void 0,
                        void 0,
                        function () {
                          var module_translations, _a, name, _b, description
                          return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                              case 0:
                                return [
                                  4 /*yield*/,
                                  ctx.db.studyModuleTranslation.findMany({
                                    where: {
                                      study_module_id: module.id,
                                      language: language,
                                    },
                                  }),
                                ]
                              case 1:
                                module_translations = _c.sent()
                                if (!module_translations.length) {
                                  return [2 /*return*/, Promise.resolve(null)]
                                }
                                ;(_a = module_translations[0]),
                                  (name = _a.name),
                                  (_b = _a.description),
                                  (description = _b === void 0 ? "" : _b)
                                return [
                                  2 /*return*/,
                                  tslib_1.__assign(
                                    tslib_1.__assign({}, module),
                                    { name: name, description: description },
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
                return [3 /*break*/, 4]
              case 3:
                _a = modules.map(function (module) {
                  return tslib_1.__assign(tslib_1.__assign({}, module), {
                    description: "",
                  })
                })
                _c.label = 4
              case 4:
                filtered = _a
                return [2 /*return*/, filtered]
            }
          })
        })
      },
    })
    t.field("study_module_exists", {
      type: "Boolean",
      args: {
        slug: nexus_1.schema.stringArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var slug = _a.slug
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.studyModule.findMany({ where: { slug: slug } }),
                ]
              case 1:
                return [2 /*return*/, _b.sent().length > 0]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=queries.js.map
