"use strict"
exports.__esModule = true
exports.Convert = void 0
// Converts JSON strings to/from your types
var Convert = /** @class */ (function () {
  function Convert() {}
  Convert.toUserInfo = function (json) {
    return JSON.parse(json)
  }
  Convert.userInfoToJson = function (value) {
    return JSON.stringify(value)
  }
  return Convert
})()
exports.Convert = Convert
//# sourceMappingURL=UserInfo.js.map
