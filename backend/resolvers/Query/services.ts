import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"

const services = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const prisma: Prisma = ctx.prisma
  return prisma.services()
}

export default services
