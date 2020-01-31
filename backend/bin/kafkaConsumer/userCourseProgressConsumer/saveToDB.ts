import { Message } from "./interfaces"
import { DateTime } from "luxon"
import {
  Prisma,
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "../../../generated/prisma-client"
import TmcClient from "../../../services/tmc"
import { generateUserCourseProgress } from "./generateUserCourseProgress"
import { Logger } from "winston"

const isUserInDB = async (prisma: Prisma, user_id: number) => {
  return await prisma.$exists.user({ upstream_id: user_id })
}

const getUserFromTMC = async (
  prisma: Prisma,
  user_id: number,
): Promise<User> => {
  const tmc: TmcClient = new TmcClient()
  const userDetails = await tmc.getUserDetailsById(user_id)

  return prisma.createUser({
    upstream_id: userDetails.id,
    first_name: userDetails.user_field.first_name,
    last_name: userDetails.user_field.last_name,
    email: userDetails.email,
    username: userDetails.username,
    administrator: userDetails.administrator,
  })
}

export const saveToDatabase = async (
  message: Message,
  prisma: Prisma,
  logger: Logger,
) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  let user: User | null

  if (await isUserInDB(prisma, message.user_id)) {
    user = await prisma.user({ upstream_id: message.user_id })
  } else {
    user = await getUserFromTMC(prisma, message.user_id)
  }

  const course = await prisma.course({ id: message.course_id })

  if (!user || !course) {
    process.exit(1)
  }

  const userCourseProgresses: UserCourseProgress[] = await prisma.userCourseProgresses(
    {
      where: {
        user: { id: user?.id },
        course: { id: message.course_id },
      },
    },
  )

  let userCourseProgress = userCourseProgresses[0]

  if (!userCourseProgress) {
    userCourseProgress = await prisma.createUserCourseProgress({
      course: { connect: { id: message.course_id } },
      user: { connect: { id: user?.id } },
      progress: message.progress,
    })
  }

  const userCourseServiceProgresses: UserCourseServiceProgress[] = await prisma.userCourseServiceProgresses(
    {
      where: {
        user: { id: user?.id },
        course: { id: message.course_id },
        service: { id: message.service_id },
      },
    },
  )

  const userCourseServiceProgress = userCourseServiceProgresses[0]

  if (userCourseServiceProgress) {
    const oldTimestamp = DateTime.fromISO(
      userCourseServiceProgress.timestamp ?? "",
    )

    if (timestamp < oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    await prisma.updateUserCourseServiceProgress({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress,
        timestamp: timestamp.toJSDate(),
      },
    })
  } else {
    await prisma.createUserCourseServiceProgress({
      user: { connect: { id: user?.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,
      user_course_progress: { connect: { id: userCourseProgress.id } },
      timestamp: timestamp.toJSDate(),
    })
  }

  await generateUserCourseProgress({ user, course, userCourseProgress })

  logger.info("Saved to DB succesfully")
  return true
}
