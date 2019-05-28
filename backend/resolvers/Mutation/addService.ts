import { ForbiddenError } from "apollo-server-core"
import { Prisma } from "../../generated/prisma-client"

const addService = async (_, args, ctx) => {
  const prisma: Prisma = ctx.prisma
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { url, name } = args
  return await prisma.createService({ url: url, name: name })
}

export default addService
