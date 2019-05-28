import { Prisma } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"

const userCourseProgress = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { user_id, course_id } = args
  const prisma: Prisma = ctx.prisma
  const result = await prisma.userCourseProgresses({
    where: {
      user: { id: user_id },
      course: { id: course_id },
    },
  })
  if (!result.length) throw new UserInputError("Not found")
  return result[0]
}

export default userCourseProgress
