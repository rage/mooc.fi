import KafkaProducer, { ProducerMessage } from "../services/kafkaProducer"
import { DateTime } from "luxon"
import prismaClient from "./lib/prisma"
import sentryLogger from "./lib/logger"

const logger = sentryLogger({ service: "update-course-statuses" })

const prisma = prismaClient()

const updateCourseStatuses = async () => {
  logger.info("Fetching list of courses")
  const courses = await prisma.course.findMany()
  logger.info(`Checking ${courses.length} courses...`)
  const kafkaProducer = new KafkaProducer()

  for (const course of courses) {
    logger.info(`Handling course ${course.id}`)
    const { status } = course

    let newStatus = status

    const courseStartDate = course.start_date
      ? DateTime.fromISO(course.start_date)
      : null
    const courseEndDate = course.end_date
      ? DateTime.fromISO(course.end_date)
      : null
    const currentDate = DateTime.local()
    if (
      newStatus === "Upcoming" &&
      courseStartDate &&
      currentDate >= courseStartDate
    ) {
      newStatus = "Active"
    }
    if (
      newStatus === "Active" &&
      courseEndDate &&
      currentDate > courseEndDate
    ) {
      newStatus = "Ended"
    }

    if (status === newStatus) {
      logger.info("Status does not need updating. Continuing...")
      continue
    }

    logger.info("Updating course status")
    const updatedCourse = await prisma.course.update({
      where: {
        id: course.id,
      },
      data: {
        status: newStatus,
      },
    })
    logger.info(`Updated course ${course.name} from ${status} to ${newStatus}`)
    const msg: ProducerMessage = {
      message: JSON.stringify(updatedCourse),
      partition: null,
      topic: "updated-course-status",
    }
    logger.info("Producing the change to Kafka")
    await kafkaProducer.queueProducerMessage(msg)
  }
  logger.info("Disconnecting from Kafka")
  await kafkaProducer.disconnect()
}

updateCourseStatuses()

logger.info("Done")
process.exit(0)
