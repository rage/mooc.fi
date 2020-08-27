"use strict"
exports.__esModule = true
exports.filterNull = exports.convertPagination = exports.buildSearch = void 0
var tslib_1 = require("tslib")
var notEmpty_1 = require("./notEmpty")
var flatten = function (arr) {
  return arr.reduce(function (acc, val) {
    return acc.concat(val)
  }, [])
}
var titleCase = function (s) {
  return s && s.length > 0
    ? s.toLowerCase()[0].toUpperCase() + s.toLowerCase().slice(1)
    : undefined
}
exports.buildSearch = function (fields, search) {
  return search
    ? flatten(
        fields.map(function (f) {
          var _a, _b, _c
          return [
            ((_a = {}), (_a[f] = { contains: search }), _a),
            ((_b = {}), (_b[f] = { contains: titleCase(search) }), _b),
            ((_c = {}), (_c[f] = { contains: search.toLowerCase() }), _c),
          ]
        }),
      )
    : undefined
}
exports.convertPagination = function (_a, options) {
  var _b, _c
  var first = _a.first,
    last = _a.last,
    before = _a.before,
    after = _a.after,
    skip = _a.skip
  var skipValue = skip || 0
  var _d = (options || {}).field,
    field = _d === void 0 ? "id" : _d
  if (!first && !last) {
    throw new Error("first or last must be defined")
  }
  return {
    skip: notEmpty_1.notEmpty(before) ? skipValue + 1 : skipValue,
    take: notEmpty_1.notEmpty(last)
      ? -(last !== null && last !== void 0 ? last : 0)
      : notEmpty_1.notEmpty(first)
      ? first
      : 0,
    cursor: notEmpty_1.notEmpty(before)
      ? ((_b = {}), (_b[field] = before), _b)
      : notEmpty_1.notEmpty(after)
      ? ((_c = {}), (_c[field] = after), _c)
      : undefined,
  }
}
exports.filterNull = function (o) {
  return o
    ? Object.entries(o).reduce(function (acc, _a) {
        var _b
        var k = _a[0],
          v = _a[1]
        return tslib_1.__assign(
          tslib_1.__assign({}, acc),
          ((_b = {}), (_b[k] = v == null ? undefined : v), _b),
        )
      }, {})
    : undefined
}
//# sourceMappingURL=db-functions.js.map
