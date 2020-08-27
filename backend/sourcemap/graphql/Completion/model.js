"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
nexus_1.schema.objectType({
  name: "Completion",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion_language()
    t.model.email()
    t.model.student_number()
    t.model.user_upstream_id()
    t.model.completions_registered()
    t.model.course_id()
    t.model.grade()
    t.model.certificate_id()
    t.model.eligible_for_ects()
    t.model.course()
    t.model.completion_date()
    // we're not querying completion course languages for now, and this was buggy
    /*     t.field("course", {
          type: "Course",
          args: {
            language: schema.stringArg({ required: false }),
          },
          resolve: async (parent, args, ctx) => {
            const { language } = args
            const { prisma } = ctx
    
            const course = await prisma.course({ id: parent.course })
    
            if (language) {
              const course_translations = await prisma.courseTranslations({
                where: { course, language },
              })
    
              if (!course_translations.length) {
                return course
              }
    
              const { name = course.name, description } = course_translations[0]
    
              return { ...course, name, description }
            }
    
            return course
          },
        })
     */
    t.field("user", {
      type: "User",
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_a) {
            if (ctx.disableRelations) {
              throw new apollo_server_core_1.ForbiddenError(
                "Cannot query relations when asking for more than 50 objects",
              )
            }
            return [
              2 /*return*/,
              ctx.db.completion.findOne({ where: { id: parent.id } }).user(),
            ]
          })
        })
      },
    })
    t.field("completion_link", {
      type: "String",
      nullable: true,
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course, filter, avoinLinks
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.completion
                    .findOne({ where: { id: parent.id } })
                    .course(),
                ]
              case 1:
                course = _a.sent()
                if (!course) {
                  throw new Error("course not found")
                }
                if (
                  !parent.completion_language ||
                  parent.completion_language === "unknown"
                ) {
                  filter = {
                    course_id: course.id,
                  }
                } else {
                  filter = {
                    course_id: course.id,
                    language: parent.completion_language,
                  }
                }
                return [
                  4 /*yield*/,
                  ctx.db.openUniversityRegistrationLink.findMany({
                    where: filter,
                  }),
                ]
              case 2:
                avoinLinks = _a.sent()
                if (avoinLinks.length < 1) {
                  return [2 /*return*/, null]
                }
                return [2 /*return*/, avoinLinks[0].link]
            }
          })
        })
      },
    })
    t.field("registered", {
      type: "Boolean",
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var registered
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.completionRegistered.findMany({
                    where: { completion_id: parent.id },
                  }),
                ]
              case 1:
                registered = _a.sent()
                return [2 /*return*/, registered.length > 0]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=model.js.map
