"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var lodash_1 = require("lodash")
var accessControl_1 = require("../../accessControl")
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addStudyModule", {
      type: "StudyModule",
      args: {
        study_module: nexus_1.schema.arg({
          type: "StudyModuleCreateArg",
          required: true,
        }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var study_module = _a.study_module
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var study_module_translations
          var _b
          return tslib_1.__generator(this, function (_c) {
            study_module_translations = study_module.study_module_translations
            return [
              2 /*return*/,
              ctx.db.studyModule.create({
                data: tslib_1.__assign(tslib_1.__assign({}, study_module), {
                  name:
                    (_b = study_module.name) !== null && _b !== void 0
                      ? _b
                      : "",
                  study_module_translations: !!study_module_translations
                    ? {
                        create: study_module_translations.map(function (s) {
                          var _a, _b
                          return tslib_1.__assign(tslib_1.__assign({}, s), {
                            name:
                              (_a = s.name) !== null && _a !== void 0 ? _a : "",
                            id:
                              (_b = s.id) !== null && _b !== void 0
                                ? _b
                                : undefined,
                          })
                        }),
                      }
                    : undefined,
                }),
              }),
            ]
          })
        })
      },
    })
    t.field("updateStudyModule", {
      type: "StudyModule",
      args: {
        study_module: nexus_1.schema.arg({
          type: "StudyModuleUpsertArg",
          required: true,
        }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var study_module = _a.study_module
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id,
            slug,
            new_slug,
            study_module_translations,
            existingTranslations,
            newTranslations,
            updatedTranslations,
            existingTranslationIds,
            moduleTranslationIds,
            removedTranslationIds,
            translationMutation,
            updatedModule
          return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                ;(id = study_module.id),
                  (slug = study_module.slug),
                  (new_slug = study_module.new_slug),
                  (study_module_translations =
                    study_module.study_module_translations)
                if (!slug) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide slug",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.studyModule
                    .findOne({ where: { slug: slug } })
                    .study_module_translations(),
                ]
              case 1:
                existingTranslations = _b.sent()
                newTranslations = (study_module_translations || [])
                  .filter(function (t) {
                    return !t.id
                  })
                  .map(function (t) {
                    return tslib_1.__assign(tslib_1.__assign({}, t), {
                      id: undefined,
                    })
                  })
                updatedTranslations = (study_module_translations || [])
                  .filter(function (t) {
                    return !!t.id
                  })
                  .map(function (t) {
                    return {
                      where: { id: t.id },
                      data: tslib_1.__assign(tslib_1.__assign({}, t), {
                        id: undefined,
                      }),
                    }
                  })
                existingTranslationIds = (existingTranslations || []).map(
                  function (t) {
                    return t.id
                  },
                )
                moduleTranslationIds = (study_module_translations || []).map(
                  function (t) {
                    return t.id
                  },
                )
                removedTranslationIds = existingTranslationIds
                  .filter(function (id) {
                    return !moduleTranslationIds.includes(id)
                  })
                  .map(function (id) {
                    return { id: id }
                  })
                translationMutation = {
                  create: newTranslations.length ? newTranslations : undefined,
                  updateMany: updatedTranslations.length
                    ? updatedTranslations
                    : undefined,
                  deleteMany: removedTranslationIds.length
                    ? removedTranslationIds
                    : undefined,
                }
                return [
                  4 /*yield*/,
                  ctx.db.studyModule.update({
                    where: {
                      id: id !== null && id !== void 0 ? id : undefined,
                      slug: slug,
                    },
                    data: tslib_1.__assign(
                      tslib_1.__assign(
                        {},
                        lodash_1.omit(study_module, ["new_slug"]),
                      ),
                      {
                        slug: new_slug ? new_slug : slug,
                        // FIXME/TODO: implement something like notEmpty for id field to fix typing
                        // @ts-ignore: TS doesn't get that in where: { id } the id has been already filtered
                        study_module_translations: Object.keys(
                          translationMutation,
                        ).length
                          ? translationMutation
                          : undefined,
                      },
                    ),
                  }),
                ]
              case 2:
                updatedModule = _b.sent()
                return [2 /*return*/, updatedModule]
            }
          })
        })
      },
    })
    t.field("deleteStudyModule", {
      type: "StudyModule",
      args: {
        id: nexus_1.schema.idArg({ required: false }),
        slug: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, slug, deletedModule
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(id = args.id), (slug = args.slug)
                if (!id && !slug) {
                  throw "must have at least id or slug"
                }
                return [
                  4 /*yield*/,
                  ctx.db.studyModule["delete"]({
                    where: {
                      id: id !== null && id !== void 0 ? id : undefined,
                      slug: slug !== null && slug !== void 0 ? slug : undefined,
                    },
                  }),
                ]
              case 1:
                deletedModule = _a.sent()
                return [2 /*return*/, deletedModule]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=mutations.js.map
