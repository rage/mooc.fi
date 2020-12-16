require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { User, Course, UserCourseProgress } from "@prisma/client"
import prisma from "../../../lib/prisma"
import { BAItiers } from "../../../../config/courseConfig"
import * as winston from "winston"
import { getCombinedUserCourseProgress, checkCompletion } from "./userFunctions"
import { checkBAICompletion } from "./generateBAIUserCourseProgress"

interface Props {
  user: User
  course: Course
  userCourseProgress: UserCourseProgress
  logger: winston.Logger
}

export const generateUserCourseProgress = async ({
  user,
  course,
  userCourseProgress,
  logger,
}: Props) => {
  const combined = await getCombinedUserCourseProgress(user, course)

  if (Object.values(BAItiers).includes(course.id)) {
    await checkBAICompletion({ user, course, logger })
  } else {
    await checkCompletion({ user, course, combinedProgress: combined, logger })
  }

  await prisma.userCourseProgress.update({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined.progress as any, // errors unless typed as any
      max_points: { set: combined.total_max_points },
      n_points: { set: combined.total_n_points },
    },
  })
}
