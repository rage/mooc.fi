import { ForbiddenError } from "apollo-server-core"

export enum Role {
  USER,
  ADMIN,
  ORGANIZATION, //for automated scripts, not for accounts
  VISITOR,
}
const checkAccess = (
  ctx,
  {
    allowOrganizations = false,
    disallowAdmin = false,
    allowVisitors = false,
    allowUsers = false,
  } = {},
) => {
  if (allowOrganizations && ctx.role == Role.ORGANIZATION) return true
  if (ctx.role == Role.ADMIN && !disallowAdmin) return true
  if (ctx.role == Role.USER && allowUsers) return true
  if (ctx.role == Role.VISITOR && allowVisitors) return true
  throw new ForbiddenError("Access Denied")
}

export default checkAccess
