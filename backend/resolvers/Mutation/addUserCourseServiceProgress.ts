import { Prisma, Course, User } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"

const addUserCourseServiceProgress = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { service_id, progress, user_course_progress_id } = args
  const prisma: Prisma = ctx.prisma
  const course: Course = await prisma
    .userCourseProgress({ id: user_course_progress_id })
    .course()
  const user: User = await prisma
    .userCourseProgress({ id: user_course_progress_id })
    .user()
  return prisma.createUserCourseServiceProgress({
    course: { connect: { id: course.id } },
    progress: progress,
    service: { connect: { id: service_id } },
    user: { connect: { id: user.id } },
    user_course_progress: { connect: { id: user_course_progress_id } },
  })
}

export default addUserCourseServiceProgress
