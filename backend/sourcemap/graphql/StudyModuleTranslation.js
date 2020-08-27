"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "StudyModuleTranslation",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.description()
    t.model.language()
    t.model.name()
    t.model.study_module_id()
    t.model.study_module()
  },
})
nexus_1.schema.inputObjectType({
  name: "StudyModuleTranslationCreateInput",
  definition: function (t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})
nexus_1.schema.inputObjectType({
  name: "StudyModuleTranslationUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    t.crud.studyModuleTranslations({
      pagination: false,
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("StudyModuleTranslations", {
          type: "study_module_translation",
          resolve: (_, __, ctx) => {
            // checkAccess(ctx, { allowOrganizations: false })
            return ctx.db.study_module_translation.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addStudyModuleTranslation", {
      type: "StudyModuleTranslation",
      args: {
        language: nexus_1.schema.stringArg({ required: true }),
        name: nexus_1.schema.stringArg(),
        description: nexus_1.schema.stringArg(),
        study_module: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var language,
            name,
            description,
            study_module,
            newStudyModuleTranslation
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(language = args.language),
                  (name = args.name),
                  (description = args.description),
                  (study_module = args.study_module)
                return [
                  4 /*yield*/,
                  ctx.db.studyModuleTranslation.create({
                    data: {
                      language: language,
                      name: name !== null && name !== void 0 ? name : "",
                      description:
                        description !== null && description !== void 0
                          ? description
                          : "",
                      study_module: {
                        connect: { id: study_module },
                      },
                    },
                  }),
                ]
              case 1:
                newStudyModuleTranslation = _a.sent()
                return [2 /*return*/, newStudyModuleTranslation]
            }
          })
        })
      },
    })
    t.field("updateStudyModuletranslation", {
      type: "StudyModuleTranslation",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        language: nexus_1.schema.stringArg(),
        name: nexus_1.schema.stringArg(),
        description: nexus_1.schema.stringArg(),
        study_module: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var id = args.id,
          language = args.language,
          name = args.name,
          description = args.description,
          study_module = args.study_module
        return ctx.db.studyModuleTranslation.update({
          where: { id: id },
          data: {
            description:
              description !== null && description !== void 0 ? description : "",
            language: language !== null && language !== void 0 ? language : "",
            name: name !== null && name !== void 0 ? name : "",
            study_module: {
              connect: { id: study_module },
            },
          },
        })
      },
    })
    t.field("deleteStudyModuleTranslation", {
      type: "StudyModuleTranslation",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return ctx.db.studyModuleTranslation["delete"]({ where: { id: id } })
      },
    })
  },
})
//# sourceMappingURL=StudyModuleTranslation.js.map
