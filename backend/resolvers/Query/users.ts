import { ForbiddenError } from "apollo-server-core"

const users = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  return ctx.prisma.users()
}

export default users
