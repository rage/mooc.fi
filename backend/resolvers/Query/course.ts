import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"

const course = (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { slug, id } = args
  const prisma: Prisma = ctx.prisma
  return prisma.course({
    slug: slug,
    id: id,
  })
}

export default course
