require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { User, Course, UserCourseProgress } from "@prisma/client"
import prismaClient from "../../../lib/prisma"
import { BAItiers } from "./courseConfig"
import * as winston from "winston"
import { convertUpdate } from "../../../../util/db-functions"
import { getCombinedUserCourseProgress, checkCompletion } from "./userFunctions"
import { checkBAICompletion } from "./generateBAIUserCourseProgress"

const prisma = prismaClient()
let logger: winston.Logger | null = null

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
  logger: _logger,
}: Props) => {
  logger = _logger
  const combined = await getCombinedUserCourseProgress(user, course)

  if (Object.values(BAItiers).includes(course.id)) {
    await checkBAICompletion({ user, course, logger })
  } else {
    await checkCompletion({ user, course, combinedProgress: combined, logger })
  }

  await prisma.userCourseProgress.update({
    where: { id: userCourseProgress.id },
    data: convertUpdate({
      progress: combined.progress as any, // errors unless typed as any
      max_points: combined.total_max_points,
      n_points: combined.total_n_points,
    }),
  })
}
