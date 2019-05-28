import { Prisma } from "../../generated/prisma-client"

const service = (_, args, ctx) => {
  const { service_id } = args
  const prisma: Prisma = ctx.prisma
  return prisma.service({ id: service_id })
}

export default service
