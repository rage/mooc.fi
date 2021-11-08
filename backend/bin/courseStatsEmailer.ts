import * as nodemailer from "nodemailer"

import prisma from "../prisma"
import knex from "../services/knex"
import { CourseStatsEmailerError } from "./lib/errors"
import sentryLogger from "./lib/logger"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const course_id = "bc18ca00-c632-4eb6-ab1d-36f15231c8d2"

const logger = sentryLogger({ service: "course-stats-emailer" })

const email_host = process.env.SMTP_HOST
const email_user = process.env.SMTP_USER
const email_pass = process.env.SMTP_PASS
const email_port = process.env.SMTP_PORT
const email_from = process.env.SMTP_FROM

const courseStatsEmailer = async () => {
  const startedCourseCount = await knex.raw<number>(
    `
    SELECT 
      COUNT(DISTINCT user_id) 
    FROM user_course_setting 
    WHERE course_id = ?;
  `,
    [course_id],
  )

  const completedCourseCount = await knex.raw<number>(
    `
    SELECT 
      COUNT(DISTINCT user_id) 
    FROM completion 
    WHERE course_id = ?;
  `,
    [course_id],
  )

  const atLeastOneExerciseCount = await knex.raw<number>(
    `
    SELECT 
      COUNT(DISTINCT user_id) 
    FROM exercise_completion 
    JOIN exercise e ON exercise_completion.exercise_id = e.id 
    WHERE course_id = ?;
  `,
    [course_id],
  )

  const course = await prisma.course.findUnique({
    where: {
      id: course_id,
    },
  })
  if (!course) {
    logger.error(new CourseStatsEmailerError(`Course not found: ${course_id}`))
  }

  const recipients = await prisma.courseStatsEmail.findMany({
    where: {
      course_id,
    },
  })

  const transporter = nodemailer.createTransport({
    host: email_host,
    port: parseInt(email_port || ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: email_user, // generated ethereal user
      pass: email_pass, // generated ethereal password
    },
  })

  for (const recipient of recipients) {
    const { email: email_to } = recipient
    const mailOptions = {
      from: email_from,
      to: email_to,
      subject: `Course stats for ${course!.name}`,
      text: `
        Started the course: ${startedCourseCount}\n
        Completed the course: ${completedCourseCount}\n
        Returned at least one exercise: ${atLeastOneExerciseCount}\n
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
      await prisma.courseStatsEmail.update({
        where: {
          id: recipient.id,
        },
        data: {
          last_sent_at: new Date().toISOString(),
        },
      })
    } catch (err) {
      logger.error(
        new CourseStatsEmailerError(
          `Error sending course email to ${recipient.email} for course ${
            course!.name
          }`,
          err,
        ),
      )
    }
  }
}

courseStatsEmailer()
