"use strict"
exports.__esModule = true
exports.getCurrentUserDetails = void 0
var tslib_1 = require("tslib")
var axios_1 = tslib_1.__importDefault(require("axios"))
var tmc_completion_script_1 = require("./tmc_completion_script")
var BASE_URL = "https://tmc.mooc.fi"
var TmcClient = /** @class */ (function () {
  function TmcClient(accessToken) {
    if (accessToken === void 0) {
      accessToken = null
    }
    this.accessToken = accessToken
  }
  TmcClient.prototype.getCurrentUserDetails = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res, userInfo
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              axios_1["default"].get(
                BASE_URL +
                  "/api/v8/users/current?show_user_fields=1&extra_fields=1",
                {
                  headers: { Authorization: this.accessToken },
                },
              ),
            ]
          case 1:
            res = _a.sent()
            userInfo = res.data
            return [2 /*return*/, userInfo]
        }
      })
    })
  }
  TmcClient.prototype.getUserDetailsById = function (id) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, userInfo
      var _e, _f
      return tslib_1.__generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            _b = (_a = axios_1["default"]).get
            _c = [
              BASE_URL +
                "/api/v8/users/" +
                id +
                "?show_user_fields=1&extra_fields=1",
            ]
            _e = {}
            _f = {}
            _d = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 1:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_e.headers = ((_f.Authorization = _d + _g.sent()), _f)),
                  _e),
                ]),
              ),
            ]
          case 2:
            res = _g.sent()
            userInfo = res.data
            return [2 /*return*/, userInfo]
        }
      })
    })
  }
  TmcClient.prototype.getOrganizations = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d
      var _e, _f
      return tslib_1.__generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/org.json"]
            _e = {}
            _f = {}
            _d = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 1:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_e.headers = ((_f.Authorization = _d + _g.sent()), _f)),
                  _e),
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
  TmcClient.prototype.getUserAppDatum = function (after) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f, _g, _h
      var _j, _k, _l, _m
      return tslib_1.__generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            if (!(after != null)) return [3 /*break*/, 4]
            return [4 /*yield*/, encodeURI(after)]
          case 1:
            after = _o.sent()
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/user_app_datum?after=" + after]
            _j = {}
            _k = {}
            _d = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 2:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_j.headers = ((_k.Authorization = _d + _o.sent()), _k)),
                  _j),
                ]),
              ),
            ]
          case 3:
            res = _o.sent()
            return [3 /*break*/, 7]
          case 4:
            _f = (_e = axios_1["default"]).get
            _g = [BASE_URL + "/api/v8/user_app_datum"]
            _l = {}
            _m = {}
            _h = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 5:
            return [
              4 /*yield*/,
              _f.apply(
                _e,
                _g.concat([
                  ((_l.headers = ((_m.Authorization = _h + _o.sent()), _m)),
                  _l),
                ]),
              ),
            ]
          case 6:
            res = _o.sent()
            _o.label = 7
          case 7:
            return [2 /*return*/, res.data]
        }
      })
    })
  }
  TmcClient.prototype.getUserFieldValues = function (after) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f, _g, _h
      var _j, _k, _l, _m
      return tslib_1.__generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            if (!(after != null)) return [3 /*break*/, 4]
            return [4 /*yield*/, encodeURI(after)]
          case 1:
            after = _o.sent()
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/user_field_value?after=" + after]
            _j = {}
            _k = {}
            _d = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 2:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_j.headers = ((_k.Authorization = _d + _o.sent()), _k)),
                  _j),
                ]),
              ),
            ]
          case 3:
            res = _o.sent()
            return [3 /*break*/, 7]
          case 4:
            _f = (_e = axios_1["default"]).get
            _g = [BASE_URL + "/api/v8/user_field_value"]
            _l = {}
            _m = {}
            _h = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 5:
            return [
              4 /*yield*/,
              _f.apply(
                _e,
                _g.concat([
                  ((_l.headers = ((_m.Authorization = _h + _o.sent()), _m)),
                  _l),
                ]),
              ),
            ]
          case 6:
            res = _o.sent()
            _o.label = 7
          case 7:
            return [2 /*return*/, res.data]
        }
      })
    })
  }
  return TmcClient
})()
exports["default"] = TmcClient
exports.getCurrentUserDetails = function (accessToken) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var res, userInfo
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            axios_1["default"].get(
              BASE_URL + "/api/v8/users/current?show_user_fields=true",
              {
                headers: { Authorization: "Bearer " + accessToken },
              },
            ),
          ]
        case 1:
          res = _a.sent()
          userInfo = res.data
          return [2 /*return*/, userInfo]
      }
    })
  })
}
//# sourceMappingURL=tmc.js.map
