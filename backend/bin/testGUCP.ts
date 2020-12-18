import {
  generateUserCourseProgress /*checkBAICompletion*/,
} from "./kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import prisma from "./lib/prisma"
import * as winston from "winston"

const test = async () => {
  const user = await prisma.user.findFirst({
    where: {
      username: "mikko_ai",
    },
  })

  /*
    testing:

    beginner: f5dd98e3-2d9c-40d1-a133-250379a022ad
    intermediate: a6915bf9-6a93-42bd-b146-af6f4f7e8d94
    advanced: f2114c22-c151-4588-9f2b-7cc80a8c384d
    handler: 3d896243-5a86-4bb8-8f1e-33f157a4b1d5
  */
  const course = await prisma.course.findUnique({
    where: {
      id: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
    },
  })
  const progress = await prisma.userCourseProgress.findFirst({
    where: {
      user_id: user!.id,
      course_id: course!.id,
    },
  })

  await generateUserCourseProgress({
    user: user!,
    course: course!,
    userCourseProgress: progress!,
    context: {
      prisma,
      logger: (null as unknown) as winston.Logger,
      knex: null as any,
      consumer: null as any,
      mutex: null as any,
    },
  })
  process.exit(0)
}

test()
