"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var axios_1 = tslib_1.__importDefault(require("axios"))
var SlackPoster = /** @class */ (function () {
  function SlackPoster(accessToken) {
    if (accessToken === void 0) {
      accessToken = null
    }
    this.accessToken = accessToken
  }
  SlackPoster.prototype.post = function (url, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              axios_1["default"].post(url, data)["catch"](function (err) {
                if (err) console.log(err)
              }),
            ]
          case 1:
            res = _a.sent()
            return [2 /*return*/, res]
        }
      })
    })
  }
  return SlackPoster
})()
exports["default"] = SlackPoster
//# sourceMappingURL=slackPoster.js.map
