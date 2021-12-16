import { v4 as uuidv4 } from "uuid"

import { Course, User } from "@prisma/client"

import { KafkaContext } from "../kafkaContext"
import { CombinedUserCourseProgress } from "./userFunctions"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

interface Props {
  user: User
  course: Course
  combinedUserCourseProgress: CombinedUserCourseProgress
  context: KafkaContext
}

export const checkAndSendThresholdEmail = async ({
  user,
  course,
  combinedUserCourseProgress,
  context,
}: Props) => {
  const courseEmailThresholdTemplates =
    await context.prisma.emailTemplate.findMany({
      where: {
        triggered_automatically_by_course_id: course.id,
        template_type: "threshold",
      },
    })

  // Sort threshold emails ascending, send highest threshold email as last.
  const templatesThatFulfillPoints = courseEmailThresholdTemplates
    .sort((a, b) => (a.points_threshold ?? 0) - (b.points_threshold ?? 0))
    .filter((et) => {
      if (et.points_threshold === null || et.points_threshold === undefined) {
        return false
      }
      return combinedUserCourseProgress.total_n_points >= et.points_threshold
    })

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
          id: uuidv4(),
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
