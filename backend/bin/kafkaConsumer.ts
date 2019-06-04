import {
  prisma,
  UserCourseProgress,
  User,
  UserCourseServiceProgress,
} from "../generated/prisma-client"

const kafka = require("kafka-node")
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient()
const consumer = new Consumer(
  client,
  [{ topic: "userProgress", partition: 0 }],
  {
    autoCommit: false,
  },
)

consumer.on("message", async message => {
  try {
    message = JSON.parse(message.value)
  } catch (e) {
    console.log("invalid message", e)
    return
  }
  console.log(message)
  console.log(message.timestamp)
  if (!validateMessageFormat(message)) {
    console.log("JSON VALIDATE FAILED")
    return
  }
  console.log("user_id", message)
  const user: User = await prisma.user({ upstream_id: message.user_id })
  let userCourseProgress: UserCourseProgress = (await prisma.userCourseProgresses(
    {
      where: {
        user: { id: user.id },
        course: { id: message.course_id },
      },
    },
  ))[0]
  if (!userCourseProgress) {
    userCourseProgress = await prisma.createUserCourseProgress({
      course: { connect: { id: message.course_id } },
      user: { connect: { id: user.id } },
      progress: message.progress,
    })
  }
  const userCourseServiceProgress: UserCourseServiceProgress = (await prisma.userCourseServiceProgresses(
    {
      where: {
        user: { id: user.id },
        course: { id: message.course_id },
        service: { id: message.service_id },
      },
    },
  ))[0]

  if (userCourseServiceProgress) {
    prisma.updateUserCourseServiceProgress({
      where: {
        id: userCourseServiceProgress.id,
      },
      data: {
        progress: message.progress,
      },
    })
  } else {
    prisma.createUserCourseServiceProgress({
      user: { connect: { id: user.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,
      user_course_progress: { connect: { id: userCourseProgress.id } },
    })
  }
  console.log("no errors")
})

const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  console.log(m)
  return (
    m != undefined &&
    m.timestamp &&
    m.user_id &&
    m.course_id &&
    m.progress &&
    m.service_id
  )
}
