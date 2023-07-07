import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import KafkaProducer, { ProducerMessage } from "../services/kafkaProducer"

const logger = sentryLogger({ service: "update-course-statuses" })

const updateCourseStatuses = async () => {
  logger.info("Fetching list of courses")
  const courses = await prisma.course.findMany()
  logger.info(`Checking ${courses.length} courses...`)
  const kafkaProducer = new KafkaProducer()

  for (const course of courses) {
    logger.info(`Handling course ${course.id} (${course.name})`)
    const { status, start_date, end_date } = course

    let newStatus = status

    const currentDate = new Date()
    if (newStatus === "Upcoming" && start_date && currentDate >= start_date) {
      newStatus = "Active"
    }
    if (newStatus === "Active" && end_date && currentDate > end_date) {
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
        status: { set: newStatus },
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
  await prisma.$disconnect()

  logger.info("Done")
  process.exit(0)
}

updateCourseStatuses().catch((e) => {
  logger.error(e)
  process.exit(1)
})
