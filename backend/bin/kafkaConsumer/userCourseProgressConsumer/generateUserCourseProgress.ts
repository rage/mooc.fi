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
  prisma,
} from "../../../generated/prisma-client"
import * as nodemailer from "nodemailer"
import { render } from "micromustache"
import SMTPTransport = require("nodemailer/lib/smtp-transport")
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
  const options: SMTPTransport.Options = {
    host: email_host,
    port: parseInt(email_port || ""),
    secure: false, // true for 465, false for other ports
    auth: {
      user: email_user, // generated ethereal user
      pass: email_pass, // generated ethereal password
    },
  }
  let transporter = nodemailer.createTransport(options)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email_from, // sender address
    to: user.email, // list of receivers
    subject: template.title, // Subject line
    text: await SimpleTemplateArgsReplace(template.txt_body ?? "", template), // plain text body
    html: template.html_body, // html body
  })
  console.log("Message sent: %s", info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

/* Will Replace this later. Just a simple and fast way to publish quickly.*/
const SimpleTemplateArgsReplace = async (
  template: string,
  email_template: EmailTemplate | null,
) => {
  const completion_link_slug = (await prisma.courses({
    where: { completion_email: email_template },
  }))[0].slug
  const completion_link = `https://mooc.fi/register-completion/${completion_link_slug}`
  return render(template, { completion_link: completion_link })
}
