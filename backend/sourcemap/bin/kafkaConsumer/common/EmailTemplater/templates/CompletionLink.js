"use strict"
exports.__esModule = true
exports.CompletionLink = void 0
var tslib_1 = require("tslib")
var Template_1 = tslib_1.__importDefault(require("../types/Template"))
var CompletionLink = /** @class */ (function (_super) {
  tslib_1.__extends(CompletionLink, _super)
  function CompletionLink() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  CompletionLink.prototype.resolve = function () {
    var _a
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var completion_link_slug
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
            completion_link_slug =
              (_a = _b.sent()[0]) === null || _a === void 0 ? void 0 : _a.slug
            return [
              2 /*return*/,
              "https://www.mooc.fi/register-completion/" + completion_link_slug,
            ]
        }
      })
    })
  }
  return CompletionLink
})(Template_1["default"])
exports.CompletionLink = CompletionLink
//# sourceMappingURL=CompletionLink.js.map
