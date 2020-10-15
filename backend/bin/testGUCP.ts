import {
  generateUserCourseProgress /*checkBAICompletion*/,
} from "./kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import prismaClient from "./lib/prisma"
import * as winston from "winston"

const prisma = prismaClient()

const test = async () => {
  const user = (
    await prisma.user.findMany({
      where: {
        username: "mikko_ai",
      },
    })
  )[0]
  /*
    testing:

    beginner: f5dd98e3-2d9c-40d1-a133-250379a022ad
    intermediate: a6915bf9-6a93-42bd-b146-af6f4f7e8d94
    advanced: f2114c22-c151-4588-9f2b-7cc80a8c384d
    handler: 3d896243-5a86-4bb8-8f1e-33f157a4b1d5
  */
  const course = await prisma.course.findOne({
    where: {
      id: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
    },
  })
  const progress = (
    await prisma.userCourseProgress.findMany({
      where: {
        user_id: user.id,
        course_id: course!.id,
      },
    })
  )?.[0]

  await generateUserCourseProgress({
    user,
    course: course!,
    userCourseProgress: progress!,
    logger: (null as unknown) as winston.Logger,
  })
  process.exit(0)
}

test()
