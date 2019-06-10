require("dotenv-safe").config()
import {
  prisma,
  UserCourseProgress,
  User,
  UserCourseServiceProgress,
  Prisma,
} from "../generated/prisma-client"
import { Mutex } from "await-semaphore"
import * as kafka from "kafka-node"
import { DateTime } from "luxon"
import { PointsByGroup } from "../types"
import TmcClient from "../services/tmc"

const mutex = new Mutex()
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" })
const consumer = new Consumer(client, [{ topic: "test5", partition: 0 }], {
  autoCommit: true,
})

consumer.on("message", async kafkaMessage => {
  //Going to mutex
  const release = await mutex.acquire()
  console.log("---------------------------------------------------------")

  console.log(kafkaMessage)
  let message: Message
  try {
    message = JSON.parse(kafkaMessage.value.toString("utf8"))
  } catch (e) {
    console.log("invalid message", e)
    release()
    return
  }

  if (!validateMessageFormat(message)) {
    console.log("JSON VALIDATE FAILED")
    release()
    return
  }
  try {
    if (!validatePointsByGroupArray(message.progress)) {
      console.log("Progress is not valid")
      release()
      return
    }
  } catch (error) {
    console.log("validating progress format failed with error:", error)
    release()
    return
  }

  try {
    if (!(await saveToDatabase(message))) {
      console.log("Could not save event to database")
    }
  } catch (error) {
    console.log("Could not save event to database:", error)
  }
  //Releasing mutex
  console.log("---------------------------------------------------------")
  release()
})

const validateTimestamp = (timestamp: DateTime) => {
  return timestamp.invalid == null
}

const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  return (
    m != undefined &&
    m.timestamp &&
    m.user_id &&
    m.course_id &&
    m.progress &&
    m.service_id
  )
}

const validatePointsByGroupArray = (
  pointsByGroupArray: [PointsByGroup],
): Boolean => {
  let valid: Boolean = true
  console.log(pointsByGroupArray)
  if (pointsByGroupArray.length < 1) return false
  return !pointsByGroupArray.some(entry => {
    return !validatePointsByGroup(entry)
  })
}

const validatePointsByGroup = (pointsByGroup: PointsByGroup): Boolean => {
  return (
    pointsByGroup != null &&
    pointsByGroup.group &&
    pointsByGroup.max_points &&
    !isNaN(pointsByGroup.max_points) &&
    pointsByGroup.n_points &&
    !isNaN(pointsByGroup.n_points) &&
    pointsByGroup.progress &&
    !isNaN(pointsByGroup.progress)
  )
}
interface Message {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: [PointsByGroup]
}

interface PointsByGroup {
  group: string
  max_points: number
  n_points: number
  progress: number
}

const isUserInDB = async (prisma: Prisma, user_id) => {
  return await prisma.$exists.user({ upstream_id: user_id })
}

const getUserFromTMC = async (prisma: Prisma, user_id): Promise<User> => {
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

const saveToDatabase = async (message: Message) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)
  if (!validateTimestamp(timestamp)) {
    console.log("invalid timestamp")
    return
  }
  let user: User
  if (await isUserInDB(prisma, message.user_id)) {
    user = await prisma.user({ upstream_id: message.user_id })
  } else {
    user = await getUserFromTMC(prisma, message.user_id)
  }
  const userCourseProgresses: UserCourseProgress[] = await prisma.userCourseProgresses(
    {
      where: {
        user: { id: user.id },
        course: { id: message.course_id },
      },
    },
  )

  let userCourseProgress = userCourseProgresses[0]
  if (!userCourseProgress) {
    userCourseProgress = await prisma.createUserCourseProgress({
      course: { connect: { id: message.course_id } },
      user: { connect: { id: user.id } },
      progress: message.progress,
    })
  }
  const userCourseServiceProgresses: UserCourseServiceProgress[] = await prisma.userCourseServiceProgresses(
    {
      where: {
        user: { id: user.id },
        course: { id: message.course_id },
        service: { id: message.service_id },
      },
    },
  )
  const userCourseServiceProgress = userCourseServiceProgresses[0]
  if (userCourseServiceProgress) {
    const oldTimestamp = DateTime.fromISO(userCourseServiceProgress.timestamp)
    if (timestamp < oldTimestamp) {
      console.log("Timestamp older than in DB, aborting")
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
      user: { connect: { id: user.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,
      user_course_progress: { connect: { id: userCourseProgress.id } },
      timestamp: timestamp.toJSDate(),
    })
  }
  await generateUserCourseProgress(userCourseProgress, prisma)
  console.log("Saved to DB succesfully")
  return true
}

const generateUserCourseProgress = async (
  userCourseProgress: UserCourseProgress,
  prisma: Prisma,
) => {
  const userCourseServiceProgresses = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .user_course_service_progresses()
  const progresses = userCourseServiceProgresses.map(entry => {
    return entry.progress
  })
  let combined = []
  console.log("progresses", progresses)
  progresses.map(entry => {
    combined.push(...entry)
  })
  await prisma.updateUserCourseProgress({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined,
    },
  })
}
