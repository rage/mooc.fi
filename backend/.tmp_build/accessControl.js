"use strict"
exports.__esModule = true
exports.Role = void 0
var apollo_server_core_1 = require("apollo-server-core")
var Role
;(function (Role) {
  Role[(Role["USER"] = 0)] = "USER"
  Role[(Role["ADMIN"] = 1)] = "ADMIN"
  Role[(Role["ORGANIZATION"] = 2)] = "ORGANIZATION"
  Role[(Role["VISITOR"] = 3)] = "VISITOR"
})((Role = exports.Role || (exports.Role = {})))
var checkAccess = function (ctx, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.allowOrganizations,
    allowOrganizations = _c === void 0 ? false : _c,
    _d = _b.disallowAdmin,
    disallowAdmin = _d === void 0 ? false : _d,
    _e = _b.allowVisitors,
    allowVisitors = _e === void 0 ? false : _e,
    _f = _b.allowUsers,
    allowUsers = _f === void 0 ? false : _f
  // console.log(`role: ${Role[ctx.role]}, orgs ${allowOrganizations} no-admins ${disallowAdmin}, visitor ${allowVisitors}, users ${allowUsers}`)
  if (allowOrganizations && ctx.role == Role.ORGANIZATION) return true
  if (ctx.role == Role.ADMIN && !disallowAdmin) return true
  if (ctx.role == Role.USER && allowUsers) return true
  if (ctx.role == Role.VISITOR && allowVisitors) return true
  throw new apollo_server_core_1.ForbiddenError("Access Denied")
}
exports["default"] = checkAccess
