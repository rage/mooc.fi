"use strict"
exports.__esModule = true
exports.createCertificate = exports.checkCertificate = void 0
var tslib_1 = require("tslib")
var axios_1 = tslib_1.__importDefault(require("axios"))
var BASE_URL = "https://certificates.mooc.fi"
exports.checkCertificate = function (courseId, accessToken) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var res
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            axios_1["default"].get(
              BASE_URL + "/certificate-availability/" + courseId,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              },
            ),
          ]
        case 1:
          res = _a.sent()
          return [
            2 /*return*/,
            res === null || res === void 0 ? void 0 : res.data,
          ]
      }
    })
  })
}
exports.createCertificate = function (courseId, accessToken) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var res, e_1
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3])
          return [
            4 /*yield*/,
            axios_1["default"].post(
              BASE_URL + "/create/" + courseId,
              undefined,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              },
            ),
          ]
        case 1:
          res = _a.sent()
          return [
            2 /*return*/,
            res === null || res === void 0 ? void 0 : res.data,
          ]
        case 2:
          e_1 = _a.sent()
          console.log(e_1)
          return [2 /*return*/, null]
        case 3:
          return [2 /*return*/]
      }
    })
  })
}
//# sourceMappingURL=certificates.js.map
