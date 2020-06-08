"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.")
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
exports.__esModule = true
exports.getCurrentUserDetails = void 0
var axios_1 = require("axios")
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
    return __awaiter(this, void 0, void 0, function () {
      var res, userInfo
      return __generator(this, function (_a) {
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
    return __awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f, userInfo
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            _b = (_a = axios_1["default"]).get
            _c = [
              BASE_URL +
                "/api/v8/users/" +
                id +
                "?show_user_fields=1&extra_fields=1",
            ]
            _d = {}
            _e = {}
            _f = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 1:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_d.headers = ((_e.Authorization = _f + _g.sent()), _e)),
                  _d),
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
    return __awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/org.json"]
            _d = {}
            _e = {}
            _f = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 1:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_d.headers = ((_e.Authorization = _f + _g.sent()), _e)),
                  _d),
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
    return __awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            if (!(after != null)) return [3 /*break*/, 4]
            return [4 /*yield*/, encodeURI(after)]
          case 1:
            after = _o.sent()
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/user_app_datum?after=" + after]
            _d = {}
            _e = {}
            _f = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 2:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_d.headers = ((_e.Authorization = _f + _o.sent()), _e)),
                  _d),
                ]),
              ),
            ]
          case 3:
            res = _o.sent()
            return [3 /*break*/, 7]
          case 4:
            _h = (_g = axios_1["default"]).get
            _j = [BASE_URL + "/api/v8/user_app_datum"]
            _k = {}
            _l = {}
            _m = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 5:
            return [
              4 /*yield*/,
              _h.apply(
                _g,
                _j.concat([
                  ((_k.headers = ((_l.Authorization = _m + _o.sent()), _l)),
                  _k),
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
    return __awaiter(this, void 0, void 0, function () {
      var res, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            if (!(after != null)) return [3 /*break*/, 4]
            return [4 /*yield*/, encodeURI(after)]
          case 1:
            after = _o.sent()
            _b = (_a = axios_1["default"]).get
            _c = [BASE_URL + "/api/v8/user_field_value?after=" + after]
            _d = {}
            _e = {}
            _f = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 2:
            return [
              4 /*yield*/,
              _b.apply(
                _a,
                _c.concat([
                  ((_d.headers = ((_e.Authorization = _f + _o.sent()), _e)),
                  _d),
                ]),
              ),
            ]
          case 3:
            res = _o.sent()
            return [3 /*break*/, 7]
          case 4:
            _h = (_g = axios_1["default"]).get
            _j = [BASE_URL + "/api/v8/user_field_value"]
            _k = {}
            _l = {}
            _m = "Bearer "
            return [4 /*yield*/, tmc_completion_script_1.getAccessToken()]
          case 5:
            return [
              4 /*yield*/,
              _h.apply(
                _g,
                _j.concat([
                  ((_k.headers = ((_l.Authorization = _m + _o.sent()), _l)),
                  _k),
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
  return __awaiter(void 0, void 0, void 0, function () {
    var res, userInfo
    return __generator(this, function (_a) {
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
