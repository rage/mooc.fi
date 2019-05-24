import { Prisma } from "../../generated/prisma-client"
import { UserInputError } from "apollo-server-core"

const userCourseProgress = async (_, { user_id, course_id }, ctx) => {
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
