import { ForbiddenError } from "apollo-server-core"

const courseAliass = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  return ctx.prisma.CourseAliass()
}

export default courseAliass
