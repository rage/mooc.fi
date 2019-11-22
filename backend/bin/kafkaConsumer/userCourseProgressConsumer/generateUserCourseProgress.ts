require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import {
  UserCourseProgress,
  Prisma,
  Course,
  User,
  UserCourseSettings,
  EmailTemplate,
} from "../../../generated/prisma-client"
const nodemailer = require("nodemailer")
const email_host = process.env.SMTP_HOST
const email_user = process.env.SMTP_USER
const email_pass = process.env.SMTP_PASS
const email_port = process.env.SMTP_PORT
const email_from = process.env.SMTP_FROM
export const generateUserCourseProgress = async (
  userCourseProgress: UserCourseProgress,
  prisma: Prisma,
) => {
  const userCourseServiceProgresses = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .user_course_service_progresses()
  const progresses: any[] = userCourseServiceProgresses.map((entry: any) => {
    return entry.progress
  })

  let combined: any[] = []
  let total_max_points: number = 0
  let total_n_points: number = 0

  progresses.map(entry => {
    entry.forEach((p: any) => {
      p.max_points ? (total_max_points += p.max_points) : null
      p.n_points ? (total_n_points += p.n_points) : null
    })

    combined.push(...entry)
  })
  const course: Course = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .course()
  const user: User = await prisma
    .userCourseProgress({ id: userCourseProgress.id })
    .user()
  const userCourseSettingses: UserCourseSettings[] = await prisma.userCourseSettingses(
    {
      where: {
        user: user,
        course: course,
      },
    },
  )
  const userCourseSettings = userCourseSettingses[0] || null

  if (
    course.automatic_completions &&
    total_n_points >= (course.points_needed ?? 0)
  ) {
    const completions = await prisma.completions({
      where: {
        completion_language:
          userCourseSettings != null ? userCourseSettings.language : "unknown",
        user: user,
        course: course,
      },
    })
    if (completions.length < 1) {
      await prisma.createCompletion({
        course: { connect: { id: course.id } },
        email: user.email,
        user: { connect: { id: user.id } },
        user_upstream_id: user.upstream_id,
        student_number: user.student_number,
        completion_language:
          userCourseSettings != null ? userCourseSettings.language : "unknown",
      })
      const template = await prisma.course({ id: course.id }).completion_email()
      if (template) {
        sendMail(user, template)
      }
    }
  }
  await prisma.updateUserCourseProgress({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined,
      max_points: total_max_points,
      n_points: total_n_points,
    },
  })
}

async function sendMail(user: User, template: EmailTemplate) {
  //const { htmlTemplate, textTemplate } = getTemplates(student, title);
  let transporter = nodemailer.createTransport({
    host: email_host,
    port: email_port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: email_user, // generated ethereal user
      pass: email_pass, // generated ethereal password
    },
  })
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email_from, // sender address
    to: user.email, // list of receivers
    subject: template.title, // Subject line
    text: template.txt_body, // plain text body
    html: template.html_body, // html body
  })
  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
