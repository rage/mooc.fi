import { ForbiddenError } from "apollo-server-core"
import { Prisma } from "../../generated/prisma-client"

const organizations = (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { first, last, after, before } = args
  const prisma: Prisma = ctx.prisma

  return prisma.organizations({
    first: first,
    last: last,
    after: after,
    before: before,
  })
}

export default organizations
