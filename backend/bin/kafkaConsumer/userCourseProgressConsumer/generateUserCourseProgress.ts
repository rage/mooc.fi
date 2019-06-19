import { UserCourseProgress, Prisma } from "../../../generated/prisma-client"

export const generateUserCourseProgress = async (
  userCourseProgress: UserCourseProgress,
  prisma: Prisma,
) => {
  const userCourseServiceProgresses = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .user_course_service_progresses()
  const progresses = userCourseServiceProgresses.map(entry => {
    return entry.progress
  })
  let combined = []
  progresses.map(entry => {
    combined.push(...entry)
  })
  await prisma.updateUserCourseProgress({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined,
    },
  })
}
