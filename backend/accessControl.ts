import { ForbiddenError } from "apollo-server-core"
import { Context } from "./context"

export enum Role {
  USER,
  ADMIN,
  ORGANIZATION, //for automated scripts, not for accounts
  VISITOR,
}
const checkAccess = (
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

export default checkAccess
