import { Prisma } from "../../generated/prisma-client"

const addUserCourseProgress = (_, { user_id, course_id, progress }, ctx) => {
  const prisma: Prisma = ctx.prisma
  return prisma.createUserCourseProgress({
    user: { connect: { id: user_id } },
    course: { connect: { id: course_id } },
    progress: progress,
  })
}

export default addUserCourseProgress
