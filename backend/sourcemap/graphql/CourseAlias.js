"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "CourseAlias",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.course_code()
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseAliasCreateInput",
  definition: function (t) {
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseAliasUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("course_code", { required: true })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    t.crud.courseAliases({
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("CourseAliases", {
          type: "course_alias",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
            return ctx.db.course_alias.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: nexus_1.schema.stringArg({ required: true }),
        course: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_code, course, newCourseAlias
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(course_code = args.course_code), (course = args.course)
                return [
                  4 /*yield*/,
                  ctx.db.courseAlias.create({
                    data: {
                      course_code:
                        course_code !== null && course_code !== void 0
                          ? course_code
                          : "",
                      course: { connect: { id: course } },
                    },
                  }),
                ]
              case 1:
                newCourseAlias = _a.sent()
                return [2 /*return*/, newCourseAlias]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=CourseAlias.js.map
