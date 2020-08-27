"use strict"
exports.__esModule = true
exports.Grade = void 0
var tslib_1 = require("tslib")
var Template_1 = tslib_1.__importDefault(require("../types/Template"))
var Grade = /** @class */ (function (_super) {
  tslib_1.__extends(Grade, _super)
  function Grade() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  Grade.prototype.resolve = function () {
    var _a
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var course, grade
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prisma.course.findMany({
                where: { completion_email: { id: this.emailTemplate.id } },
              }),
            ]
          case 1:
            course = _b.sent()[0]
            if (!course) {
              return [2 /*return*/, ""]
            }
            return [
              4 /*yield*/,
              this.prisma.completion.findMany({
                where: {
                  user: { id: this.user.id },
                  course: { id: course.id },
                },
                orderBy: { completion_date: "desc" },
              }),
            ]
          case 2:
            grade =
              (_a = _b.sent()[0]) === null || _a === void 0 ? void 0 : _a.grade
            return [2 /*return*/, "" + grade]
        }
      })
    })
  }
  return Grade
})(Template_1["default"])
exports.Grade = Grade
//# sourceMappingURL=Grade.js.map
