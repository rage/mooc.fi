"use strict"
exports.__esModule = true
exports.getAccessToken = void 0
var tslib_1 = require("tslib")
var axios_1 = tslib_1.__importDefault(require("axios"))
//const axios = require("axios");
var _accessToken = null
function fetchAccessToken() {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var response, error_1
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log("Fetching tmc access token...")
          _a.label = 1
        case 1:
          _a.trys.push([1, 3, , 4])
          return [
            4 /*yield*/,
            axios_1["default"].post(
              process.env.TMC_HOST + "/oauth/token",
              "client_secret=" +
                process.env.TMC_CLIENT_SECRET +
                "&username=" +
                encodeURIComponent(process.env.TMC_USERNAME || "") +
                "&password=" +
                encodeURIComponent(process.env.TMC_PASSWORD || "") +
                "&grant_type=password",
              {
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                },
              },
            ),
          ]
        case 2:
          response = _a.sent()
          return [2 /*return*/, response.data.access_token]
        case 3:
          error_1 = _a.sent()
          console.log(error_1)
          return [2 /*return*/, ""]
        case 4:
          return [2 /*return*/]
      }
    })
  })
}
function getAccessToken() {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (_accessToken) {
            return [2 /*return*/, _accessToken]
          }
          return [4 /*yield*/, fetchAccessToken()]
        case 1:
          _accessToken = _a.sent()
          return [2 /*return*/, _accessToken]
      }
    })
  })
}
exports.getAccessToken = getAccessToken
function getBasicInfoByUsernames(usernames) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var res, _a, _b, _c, _d
    var _e, _f
    return tslib_1.__generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          _b = (_a = axios_1["default"]).post
          _c = [
            process.env.TMC_HOST +
              "/api/v8/users/basic_info_by_usernames?extra_fields=elements-of-ai&user_fields=1",
            {
              usernames: usernames,
            },
          ]
          _e = {}
          _f = {}
          _d = "Bearer "
          return [4 /*yield*/, getAccessToken()]
        case 1:
          return [
            4 /*yield*/,
            _b.apply(
              _a,
              _c.concat([
                ((_e.headers = ((_f.Authorization = _d + _g.sent()), _f)), _e),
              ]),
            ),
          ]
        case 2:
          res = _g.sent()
          return [2 /*return*/, res.data]
      }
    })
  })
}
module.exports = {
  getAccessToken: getAccessToken,
  getBasicInfoByUsernames: getBasicInfoByUsernames,
}
//# sourceMappingURL=tmc_completion_script.js.map
