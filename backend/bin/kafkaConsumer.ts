import {
  prisma,
  UserCourseProgress,
  User,
  UserCourseServiceProgress,
} from "../generated/prisma-client"
import { Mutex } from "await-semaphore"
import * as kafka from "kafka-node"

const mutex = new Mutex()
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient()
const consumer = new Consumer(client, [{ topic: "test2", partition: 0 }], {
  autoCommit: false,
})

consumer.on("message", async kafkaMessage => {
  console.log(kafkaMessage)
  let message
  try {
    message = JSON.parse(kafkaMessage.value.toString("utf8"))
  } catch (e) {
    console.log("invalid message", e)
    return
  }

  if (!validateMessageFormat(message)) {
    console.log("JSON VALIDATE FAILED")
    return
  }

  //Going to mutex
  const release = await mutex.acquire()

  try {
    await saveToDatabase(message)
  } catch (error) {
    console.log("Could not save event to database:", error)
  }

  //Releasing mutex
  release()
})

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
const saveToDatabase = async (message: any) => {
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
    await prisma.updateUserCourseServiceProgress({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress,
      },
    })
  } else {
    await prisma.createUserCourseServiceProgress({
      user: { connect: { id: user.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,
      user_course_progress: { connect: { id: userCourseProgress.id } },
    })
  }
}
