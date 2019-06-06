import {
  prisma,
  UserCourseProgress,
  User,
  UserCourseServiceProgress,
} from "../generated/prisma-client"
import { Mutex } from "await-semaphore"
import * as kafka from "kafka-node"
import { DateTime } from "luxon"

const mutex = new Mutex()
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient()
const consumer = new Consumer(client, [{ topic: "test3", partition: 0 }], {
  autoCommit: false,
})

consumer.on("message", async kafkaMessage => {
  //Going to mutex
  const release = await mutex.acquire()
  console.log("---------------------------------------------------------")

  console.log(kafkaMessage)
  let message
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

interface Message {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: [any]
}

const saveToDatabase = async (message: Message) => {
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)
  if (!validateTimestamp(timestamp)) {
    console.log("invalid timestamp")
    return
  }

  const user: User = await prisma.user({ upstream_id: message.user_id })
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
  console.log("db success")
  return true
}
