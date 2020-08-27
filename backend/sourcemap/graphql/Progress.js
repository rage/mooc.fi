"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
nexus_1.schema.objectType({
  name: "Progress",
  definition: function (t) {
    var _this = this
    t.field("course", { type: "Course" })
    t.field("user", { type: "User" })
    t.field("user_course_progress", {
      type: "UserCourseProgress",
      nullable: true,
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, user_id, userCourseProgresses
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                course_id =
                  (_a = parent.course) === null || _a === void 0
                    ? void 0
                    : _a.id
                user_id =
                  (_b = parent.user) === null || _b === void 0 ? void 0 : _b.id
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findMany({
                    where: { course_id: course_id, user_id: user_id },
                  }),
                ]
              case 1:
                userCourseProgresses = _c.sent()
                return [2 /*return*/, userCourseProgresses[0]]
            }
          })
        })
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, user_id
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            course_id =
              (_a = parent.course) === null || _a === void 0 ? void 0 : _a.id
            user_id =
              (_b = parent.user) === null || _b === void 0 ? void 0 : _b.id
            return [
              2 /*return*/,
              ctx.db.userCourseServiceProgress.findMany({
                where: { user_id: user_id, course_id: course_id },
              }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=Progress.js.map
