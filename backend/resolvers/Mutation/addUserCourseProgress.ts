import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"

const addUserCourseProgress = (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { user_id, course_id, progress } = args
  const prisma: Prisma = ctx.prisma
  return prisma.createUserCourseProgress({
    user: { connect: { id: user_id } },
    course: { connect: { id: course_id } },
    progress: progress,
  })
}

export default addUserCourseProgress
