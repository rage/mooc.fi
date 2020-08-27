"use strict"
// import { ForbiddenError } from "apollo-server-core"
// import { NexusContext } from "./context"
exports.__esModule = true
exports.not = exports.and = exports.or = exports.isVisitor = exports.isOrganization = exports.isUser = exports.isAdmin = exports.Role = void 0
var Role
;(function (Role) {
  Role[(Role["USER"] = 0)] = "USER"
  Role[(Role["ADMIN"] = 1)] = "ADMIN"
  Role[(Role["ORGANIZATION"] = 2)] = "ORGANIZATION"
  Role[(Role["VISITOR"] = 3)] = "VISITOR"
})((Role = exports.Role || (exports.Role = {})))
// TODO: caching?
exports.isAdmin = function (_, _args, ctx, _info) {
  return ctx.role === Role.ADMIN
}
exports.isUser = function (_, _args, ctx, _info) {
  return ctx.role === Role.USER
}
exports.isOrganization = function (_, _args, ctx, _info) {
  return ctx.role === Role.ORGANIZATION
}
exports.isVisitor = function (_, _args, ctx, _info) {
  return ctx.role === Role.VISITOR
}
exports.or = function () {
  var predicates = []
  for (var _i = 0; _i < arguments.length; _i++) {
    predicates[_i] = arguments[_i]
  }
  return function (root, args, ctx, info) {
    return predicates.some(function (p) {
      return p(root, args, ctx, info)
    })
  }
}
exports.and = function () {
  var predicates = []
  for (var _i = 0; _i < arguments.length; _i++) {
    predicates[_i] = arguments[_i]
  }
  return function (root, args, ctx, info) {
    return predicates.every(function (p) {
      return p(root, args, ctx, info)
    })
  }
}
exports.not = function (fn) {
  return function (root, args, ctx, info) {
    return !fn(root, args, ctx, info)
  }
}
/*const checkAccess = (
  ctx: Context,
  {
    allowOrganizations = false,
    disallowAdmin = false,
    allowVisitors = false,
    allowUsers = false,
  } = {},
) => {
  // console.log(`role: ${Role[ctx.role]}, orgs ${allowOrganizations} no-admins ${disallowAdmin}, visitor ${allowVisitors}, users ${allowUsers}`)
  if (allowOrganizations && ctx.role == Role.ORGANIZATION) return true
  if (ctx.role == Role.ADMIN && !disallowAdmin) return true
  if (ctx.role == Role.USER && allowUsers) return true
  if (ctx.role == Role.VISITOR && allowVisitors) return true
  throw new ForbiddenError("Access Denied")
}

export default checkAccess*/
//# sourceMappingURL=accessControl.js.map
