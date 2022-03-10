import { Course, User, UserCourseProgress } from "@prisma/client"

import { BAItiers } from "../../../../config/courseConfig"
import { KafkaContext } from "../kafkaContext"
import { checkAndSendThresholdEmail } from "./checkAndSendThresholdEmail"
import { checkBAICompletion } from "./generateBAIUserCourseProgress"
import { checkCompletion, getCombinedUserCourseProgress } from "./userFunctions"

interface Props {
  user: User
  course: Course
  userCourseProgress: UserCourseProgress
  context: KafkaContext
}

export const generateUserCourseProgress = async ({
  user,
  course,
  userCourseProgress,
  context,
}: Props) => {
  const combined = await getCombinedUserCourseProgress({
    user,
    course,
    context,
  })

  if (Object.values(BAItiers).includes(course.id)) {
    await checkBAICompletion({ user, course, context })
  } else {
    await checkCompletion({ user, course, combinedProgress: combined, context })
  }

  await checkAndSendThresholdEmail({
    user,
    course,
    combinedUserCourseProgress: combined,
    context,
  })

  await context.prisma.userCourseProgress.update({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined.progress as any, // errors unless typed as any
      max_points: { set: combined.total_max_points },
      n_points: { set: combined.total_n_points },
    },
  })
}
