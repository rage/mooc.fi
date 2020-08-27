"use strict"
exports.__esModule = true
exports.EmailTemplater = void 0
var tslib_1 = require("tslib")
var micromustache_1 = require("micromustache")
var Templates = tslib_1.__importStar(require("./templates"))
var EmailTemplater = /** @class */ (function () {
  function EmailTemplater(emailTemplate, user, prisma) {
    this.keyWordToTemplate = {
      completion_link: Templates.CompletionLink,
      grade: Templates.Grade,
    }
    this.emailTemplate = emailTemplate
    this.user = user
    this.prisma = prisma
    this.prepare()
  }
  EmailTemplater.prototype.resolve = function () {
    var _a
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var template
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            template =
              (_a = this.emailTemplate.txt_body) !== null && _a !== void 0
                ? _a
                : ""
            return [4 /*yield*/, this.resolveAllTemplates()]
          case 1:
            _b.sent()
            return [
              2 /*return*/,
              micromustache_1.render(template, this.keyWordToTemplate),
            ]
        }
      })
    })
  }
  EmailTemplater.prototype.prepare = function () {
    var _this = this
    Object.getOwnPropertyNames(this.keyWordToTemplate).forEach(function (p) {
      _this.keyWordToTemplate[p] = new _this.keyWordToTemplate[p]({
        emailTemplate: _this.emailTemplate,
        user: _this.user,
        prisma: _this.prisma,
      })
    })
  }
  EmailTemplater.prototype.resolveAllTemplates = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var _this = this
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.asyncForEach(
                Object.getOwnPropertyNames(this.keyWordToTemplate),
                function (p) {
                  return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, _b
                    return tslib_1.__generator(this, function (_c) {
                      switch (_c.label) {
                        case 0:
                          _a = this.keyWordToTemplate
                          _b = p
                          return [
                            4 /*yield*/,
                            this.keyWordToTemplate[p].resolve(),
                          ]
                        case 1:
                          _a[_b] = _c.sent()
                          return [2 /*return*/]
                      }
                    })
                  })
                },
              ),
            ]
          case 1:
            _a.sent()
            return [2 /*return*/]
        }
      })
    })
  }
  EmailTemplater.prototype.asyncForEach = function (array, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var index
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            index = 0
            _a.label = 1
          case 1:
            if (!(index < array.length)) return [3 /*break*/, 4]
            return [4 /*yield*/, callback(array[index], index, array)]
          case 2:
            _a.sent()
            _a.label = 3
          case 3:
            index++
            return [3 /*break*/, 1]
          case 4:
            return [2 /*return*/]
        }
      })
    })
  }
  return EmailTemplater
})()
exports.EmailTemplater = EmailTemplater
//# sourceMappingURL=EmailTemplater.js.map
