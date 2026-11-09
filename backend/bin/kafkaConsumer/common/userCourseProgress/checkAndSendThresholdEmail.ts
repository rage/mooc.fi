import { randomUUID } from "crypto"

import { BaseContext } from "../../../../context"
import { Course, User } from "../../../../generated/prisma"
import { CombinedUserCourseProgress } from "../userFunctions"

interface CheckAndSendThresholdEmailArgs {
  user: User
  course: Course
  combinedUserCourseProgress: CombinedUserCourseProgress
  context: BaseContext
}

export const checkAndSendThresholdEmail = async ({
  user,
  course,
  combinedUserCourseProgress,
  context,
}: CheckAndSendThresholdEmailArgs) => {
  const courseEmailThresholdTemplates =
    await context.prisma.emailTemplate.findMany({
      where: {
        triggered_automatically_by_course_id: course.id,
        template_type: "threshold",
      },
    })

  // Sort threshold emails ascending, send highest threshold email as last.
  courseEmailThresholdTemplates.sort(
    (a, b) => (a.points_threshold ?? 0) - (b.points_threshold ?? 0),
  )

  const templatesThatFulfillPoints = courseEmailThresholdTemplates.filter(
    (et) => {
      if (et.points_threshold === null || et.points_threshold === undefined) {
        return false
      }
      return combinedUserCourseProgress.total_n_points >= et.points_threshold
    },
  )

  for (const template of templatesThatFulfillPoints) {
    const mailSent = await context.prisma.emailDelivery.findFirst({
      where: {
        email_template_id: template.id,
        user_id: user.id,
      },
    })

    if (!mailSent) {
      await context.prisma.emailDelivery.create({
        data: {
          id: randomUUID(),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: user.id,
          email_template_id: template.id,
          sent: false,
          error: false,
        },
      })
    }
  }
}
