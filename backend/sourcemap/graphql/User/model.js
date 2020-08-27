"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "User",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.administrator()
    t.model.created_at()
    t.model.email()
    t.model.first_name()
    t.model.last_name()
    t.model.real_student_number()
    t.model.student_number()
    t.model.updated_at()
    t.model.upstream_id()
    t.model.username()
    // t.model.completions()
    t.model.completions_registered()
    t.model.email_deliveries()
    t.model.exercise_completions()
    t.model.organizations()
    t.model.user_course_progresses()
    t.model.user_course_service_progresses()
    t.model.user_course_settings()
    t.model.user_organizations()
    t.model.verified_users()
    t.model.research_consent()
    // t.prismaFields({ filter: ["completions"] })
    t.field("completions", {
      type: "Completion",
      list: true,
      nullable: false,
      args: {
        course_id: nexus_1.schema.stringArg({ required: false }),
        course_slug: nexus_1.schema.stringArg({ required: false }),
      },
      resolve: function (parent, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, course_slug, handlerCourse
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(course_id = args.course_id), (course_slug = args.course_slug)
                if (!(course_id || course_slug)) return [3 /*break*/, 2]
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({
                      where: {
                        id:
                          (_a = args.course_id) !== null && _a !== void 0
                            ? _a
                            : undefined,
                        slug:
                          (_b = args.course_slug) !== null && _b !== void 0
                            ? _b
                            : undefined,
                      },
                    })
                    .completions_handled_by(),
                ]
              case 1:
                handlerCourse = _c.sent()
                if (handlerCourse) {
                  course_id = handlerCourse.id
                  course_slug = undefined
                }
                _c.label = 2
              case 2:
                return [
                  2 /*return*/,
                  ctx.db.completion.findMany({
                    where: {
                      user_id: parent.id,
                      course:
                        course_id || course_slug
                          ? {
                              id:
                                course_id !== null && course_id !== void 0
                                  ? course_id
                                  : undefined,
                              slug:
                                course_slug !== null && course_slug !== void 0
                                  ? course_slug
                                  : undefined,
                            }
                          : undefined,
                    },
                  }),
                ]
            }
          })
        })
      },
    })
    t.field("progress", {
      type: "Progress",
      nullable: false,
      args: {
        course_id: nexus_1.schema.idArg({ required: true }),
      },
      resolve: function (parent, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.course.findOne({
                    where: { id: args.course_id },
                  }),
                ]
              case 1:
                course = _a.sent()
                return [
                  2 /*return*/,
                  {
                    course: course,
                    user: parent,
                  },
                ]
            }
          })
        })
      },
    })
    t.field("progresses", {
      type: "Progress",
      list: true,
      nullable: false,
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_course_progressess, progresses
          var _this = this
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findMany({
                    where: { user_id: parent.id },
                  }),
                ]
              case 1:
                user_course_progressess = _a.sent()
                progresses = user_course_progressess.map(function (p) {
                  return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var course
                    return tslib_1.__generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            ctx.db.userCourseProgress
                              .findOne({ where: { id: p.id } })
                              .course(),
                          ]
                        case 1:
                          course = _a.sent()
                          return [
                            2 /*return*/,
                            {
                              course: course,
                              user: parent,
                            },
                          ]
                      }
                    })
                  })
                })
                return [2 /*return*/, progresses]
            }
          })
        })
      },
    })
    // TODO/FIXME: is this used anywhere? if is, find better name
    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      nullable: true,
      args: {
        course_id: nexus_1.schema.idArg(),
      },
      resolve: function (parent, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, progresses
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                course_id = args.course_id
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findMany({
                    where: {
                      user_id: parent.id,
                      course_id: course_id,
                    },
                  }),
                ]
              case 1:
                progresses = _a.sent()
                if (progresses.length > 0) {
                  return [2 /*return*/, progresses[0]]
                } else {
                  return [2 /*return*/, null]
                }
                return [2 /*return*/]
            }
          })
        })
      },
    })
    t.field("exercise_completions", {
      type: "ExerciseCompletion",
      list: true,
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_a) {
            return [
              2 /*return*/,
              ctx.db.exerciseCompletion.findMany({
                where: {
                  user_id: parent.id,
                },
              }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=model.js.map
