import {
  UserCourseProgress,
  Prisma,
  Course,
  User,
  UserCourseSettings,
} from "../../../generated/prisma-client"

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
  let total_max_points: number = 0
  let total_n_points: number = 0
  progresses.map(entry => {
    entry.max_points ? (total_max_points += entry.max_points) : null
    entry.n_points ? (total_n_points += entry.n_points) : null
    combined.push(...entry)
  })
  const course: Course = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .course()
  const user: User = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .user()
  const userCourseSettingses: UserCourseSettings[] = await prisma.userCourseSettingses(
    {
      where: {
        user: user,
        course: course,
      },
    },
  )
  const userCourseSettings = userCourseSettingses[0]
  if (course.automatic_completions && total_n_points >= course.points_needed) {
    await prisma.createCompletion({
      course: { connect: { id: course.id } },
      email: user.email,
      user: { connect: { id: user.id } },
      user_upstream_id: user.upstream_id,
      student_number: user.student_number,
      completion_language: userCourseSettings.language,
    })
  }
  await prisma.updateUserCourseProgress({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined,
      max_points: total_max_points,
      n_points: total_n_points,
    },
  })
}
