import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"

const service = (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { service_id } = args
  const prisma: Prisma = ctx.prisma
  return prisma.service({ id: service_id })
}

export default service
