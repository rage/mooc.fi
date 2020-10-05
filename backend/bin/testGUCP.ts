import { checkBAICompletion } from "./kafkaConsumer/userCourseProgressConsumer/generateUserCourseProgress"
import prismaClient from "./lib/prisma"

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
  await checkBAICompletion(user, course!)
}

test()