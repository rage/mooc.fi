import { PrismaClient } from "@prisma/client"
import KafkaProducer, { ProducerMessage } from "../services/kafkaProducer"
import { DateTime } from "luxon"

const prisma = new PrismaClient()

const updateCourseStatuses = async () => {
  const courses = await prisma.course.findMany({})
  const kafkaProducer = new KafkaProducer()

  Promise.all(
    courses.map(async (course) => {
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
        return Promise.resolve()
      }

      const updatedCourse = await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          status: newStatus,
        },
      })
      console.log(
        `Updated course ${course.name} from ${status} to ${newStatus}`,
      )
      const msg: ProducerMessage = {
        message: JSON.stringify(updatedCourse),
        partition: null,
        topic: "updated-course-status",
      }
      await kafkaProducer.queueProducerMessage(msg)
    }),
  )
  await kafkaProducer.disconnect()
}

updateCourseStatuses()
