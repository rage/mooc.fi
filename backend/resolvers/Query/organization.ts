import { ForbiddenError } from "apollo-server-core"
import { Prisma } from "../../generated/prisma-client"

const organization = (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { id } = args
  const prisma: Prisma = ctx.prisma
  return prisma.organization({ id: id })
}

export default organization
