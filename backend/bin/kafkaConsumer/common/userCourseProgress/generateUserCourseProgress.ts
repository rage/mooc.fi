import { BAItiers } from "../../../../config/courseConfig"
import { KafkaContext } from "../kafkaContext"
import { checkBAICompletion } from "./BAI/completion"
import { checkAndSendThresholdEmail } from "./checkAndSendThresholdEmail"
import { checkCompletion, getCombinedUserCourseProgress } from "./userFunctions"
import { Course, User, UserCourseProgress } from "@prisma/client"

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

  const handler = await context.prisma.course
    .findUnique({
      where: {
        id: course.id,
      },
    })
    .completions_handled_by()

  if (Object.values(BAItiers).includes(course.id)) {
    await checkBAICompletion({ user, course, handler, context })
  } else {
    await checkCompletion({
      user,
      course,
      handler,
      combinedProgress: combined,
      context,
    })
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
