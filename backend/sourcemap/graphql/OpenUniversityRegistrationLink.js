"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "OpenUniversityRegistrationLink",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.course_code()
    t.model.language()
    t.model.link()
    t.model.start_date()
    t.model.stop_date()
  },
})
nexus_1.schema.inputObjectType({
  name: "OpenUniversityRegistrationLinkCreateInput",
  definition: function (t) {
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})
nexus_1.schema.inputObjectType({
  name: "OpenUniversityRegistrationLinkUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("openUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_b) {
            return [
              2 /*return*/,
              ctx.db.openUniversityRegistrationLink.findOne({
                where: { id: id },
              }),
            ]
          })
        })
      },
    })
    t.crud.openUniversityRegistrationLinks({
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("openUniversityRegistrationLinks", {
          type: "open_university_registration_link",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
            return ctx.db.open_university_registration_link.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        course_code: nexus_1.schema.stringArg({ required: true }),
        course: nexus_1.schema.idArg({ required: true }),
        language: nexus_1.schema.stringArg(),
        link: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_code,
            course,
            language,
            link,
            openUniversityRegistrationLink
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(course_code = args.course_code),
                  (course = args.course),
                  (language = args.language),
                  (link = args.link)
                return [
                  4 /*yield*/,
                  ctx.db.openUniversityRegistrationLink.create({
                    data: {
                      course: {
                        connect: { id: course },
                      },
                      course_code:
                        course_code !== null && course_code !== void 0
                          ? course_code
                          : "",
                      language:
                        language !== null && language !== void 0
                          ? language
                          : "",
                      link: link,
                    },
                  }),
                ]
              case 1:
                openUniversityRegistrationLink = _a.sent()
                return [2 /*return*/, openUniversityRegistrationLink]
            }
          })
        })
      },
    })
    t.field("updateOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        course_code: nexus_1.schema.stringArg(),
        course: nexus_1.schema.idArg({ required: true }),
        language: nexus_1.schema.stringArg(),
        link: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, course_code, course, language, link
          return tslib_1.__generator(this, function (_a) {
            ;(id = args.id),
              (course_code = args.course_code),
              (course = args.course),
              (language = args.language),
              (link = args.link)
            return [
              2 /*return*/,
              ctx.db.openUniversityRegistrationLink.update({
                where: {
                  id: id,
                },
                // TODO/FIXME: this deletes the old values?
                data: {
                  course: {
                    connect: { id: course },
                  },
                  course_code:
                    course_code !== null && course_code !== void 0
                      ? course_code
                      : "",
                  language:
                    language !== null && language !== void 0 ? language : "",
                  link: link,
                },
              }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=OpenUniversityRegistrationLink.js.map
