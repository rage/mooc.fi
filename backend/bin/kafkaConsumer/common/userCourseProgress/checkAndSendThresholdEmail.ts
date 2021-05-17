require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { User, Course } from "@prisma/client"
import { CombinedUserCourseProgress } from "./userFunctions"
import { KafkaContext } from "../kafkaContext"
import { v4 as uuidv4 } from "uuid"

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
  const courseEmailThresholdTemplates = await context.prisma.emailTemplate.findMany(
    {
      where: {
        triggered_automatically_by_course_id: course.id,
        template_type: "threshold",
      },
    },
  )

  const templatesThatFulfillPoints = courseEmailThresholdTemplates
    .sort((a, b) => (b.points_threshold ?? 0) - (a.points_threshold ?? 0))
    .filter((et) => {
      return (
        combinedUserCourseProgress.total_n_points >
        (et.points_threshold ?? 99999)
      )
    })

  if (templatesThatFulfillPoints.length !== 0) {
    // Send only for the highest fulfilled?
    const mailSent = await context.prisma.emailDelivery.findFirst({
      where: {
        email_template_id: templatesThatFulfillPoints[0].id,
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
          email_template_id: templatesThatFulfillPoints[0].id,
          sent: false,
          error: false,
        },
      })
    }
  }
}
