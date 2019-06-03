import { ForbiddenError } from "apollo-server-core"

const checkAccess = (ctx, { allowOrganizations }) => {
  if (allowOrganizations && ctx.organization) return true
  if (ctx.user && ctx.user.administrator) return true
  throw new ForbiddenError("Access Denied")
}

export default checkAccess
