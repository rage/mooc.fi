"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "CourseTranslation",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.language()
    t.model.link()
    t.model.name()
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseTranslationCreateInput",
  definition: function (t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseTranslationUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    t.list.field("CourseTranslations", {
      type: "CourseTranslation",
      args: {
        language: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var language = _a.language
        return ctx.db.courseTranslation.findMany({
          where: {
            language:
              language !== null && language !== void 0 ? language : undefined,
          },
        })
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCourseTranslation", {
      type: "CourseTranslation",
      args: {
        language: nexus_1.schema.stringArg({ required: true }),
        name: nexus_1.schema.stringArg(),
        description: nexus_1.schema.stringArg(),
        link: nexus_1.schema.stringArg(),
        course: nexus_1.schema.idArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var language, name, description, link, course, newCourseTranslation
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(language = args.language),
                  (name = args.name),
                  (description = args.description),
                  (link = args.link),
                  (course = args.course)
                return [
                  4 /*yield*/,
                  ctx.db.courseTranslation.create({
                    data: {
                      language: language,
                      name: name !== null && name !== void 0 ? name : "",
                      description:
                        description !== null && description !== void 0
                          ? description
                          : "",
                      link: link,
                      course: course ? { connect: { id: course } } : undefined,
                    },
                  }),
                ]
              case 1:
                newCourseTranslation = _a.sent()
                return [2 /*return*/, newCourseTranslation]
            }
          })
        })
      },
    })
    t.field("updateCourseTranslation", {
      type: "CourseTranslation",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        language: nexus_1.schema.stringArg({ required: true }),
        name: nexus_1.schema.stringArg(),
        description: nexus_1.schema.stringArg(),
        link: nexus_1.schema.stringArg(),
        course: nexus_1.schema.idArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var id = args.id,
          language = args.language,
          name = args.name,
          description = args.description,
          link = args.link,
          course = args.course
        return ctx.db.courseTranslation.update({
          where: { id: id },
          data: {
            language: language,
            name: name !== null && name !== void 0 ? name : undefined,
            description:
              description !== null && description !== void 0
                ? description
                : undefined,
            link: link,
            course: course ? { connect: { id: course } } : undefined,
          },
        })
      },
    })
    t.field("deleteCourseTranslation", {
      type: "CourseTranslation",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return ctx.db.courseTranslation["delete"]({
          where: { id: id },
        })
      },
    })
  },
})
//# sourceMappingURL=CourseTranslation.js.map
