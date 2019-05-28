import {
  Prisma,
  UserCourseServiceProgress,
} from "../../generated/prisma-client"

const userCourseServiceProgress = async (_, args, ctx) => {
  const { user_id, course_id, service_id } = args
  const prisma: Prisma = ctx.prisma
  const result: UserCourseServiceProgress[] = await prisma.userCourseServiceProgresses(
    {
      where: {
        user: { id: user_id },
        course: { id: course_id },
        service: { id: service_id },
      },
    },
  )
  return result[0]
}

export default userCourseServiceProgress
