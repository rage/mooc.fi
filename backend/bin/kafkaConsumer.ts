require("dotenv-safe").config()
import {
  prisma,
  UserCourseProgress,
  User,
  UserCourseServiceProgress,
  Prisma,
} from "../generated/prisma-client"
import { Mutex } from "await-semaphore"
import { DateTime } from "luxon"
import { PointsByGroup } from "../types"
import TmcClient from "../services/tmc"
import * as Kafka from "node-rdkafka"
import * as winston from "winston"
let commitCounter = 0
const commitInterval = 100
const mutex = new Mutex()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer" },
  transports: [new winston.transports.Console()],
})

const logCommit = (err, topicPartitions) => {
  if (err) {
    logger.error("Error in commit:", err)
  } else {
    logger.info("Committed. topicPartitions:", topicPartitions)
  }
}

const commit = async message => {
  if (commitCounter >= commitInterval) {
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}

const handleMessage = async kafkaMessage => {
  //Going to mutex
  const release = await mutex.acquire()
  logger.info(kafkaMessage)
  let message: Message
  try {
    message = JSON.parse(kafkaMessage.value.toString("utf8"))
  } catch (e) {
    logger.error("invalid message", e)
    await commit(kafkaMessage)
    release()
    return
  }

  if (!validateMessageFormat(message)) {
    logger.error("JSON VALIDATE FAILED")
    await commit(kafkaMessage)
    release()
    return
  }
  try {
    if (!validatePointsByGroupArray(message.progress)) {
      logger.error("Progress is not valid")
      await commit(kafkaMessage)
      release()
      return
    }
  } catch (error) {
    logger.error("validating progress format failed with error:", error)
    await commit(kafkaMessage)
    release()
    return
  }

  try {
    if (!(await saveToDatabase(message))) {
      logger.error("Could not save event to database")
    }
  } catch (error) {
    logger.error("Could not save event to database:", error)
  }
  await commit(kafkaMessage)
  //Releasing mutex
  release()
}

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
    logger.error("invalid timestamp")
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
      user: { connect: { id: user.id } },
      course: { connect: { id: message.course_id } },
      service: { connect: { id: message.service_id } },
      progress: message.progress,
      user_course_progress: { connect: { id: userCourseProgress.id } },
      timestamp: timestamp.toJSDate(),
    })
  }
  await generateUserCourseProgress(userCourseProgress, prisma)
  logger.info("Saved to DB succesfully")
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

const consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": "false",
    "partition.assignment.strategy": "roundrobin",
  },
  {},
)

consumer.connect()

consumer
  .on("ready", () => {
    consumer.subscribe([process.env.KAFKA_TOPIC])
    consumer.consume()
  })
  .on("data", handleMessage)
