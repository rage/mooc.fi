import {
  UserCourseProgress,
  Prisma,
  Course,
  User,
  UserCourseSettings,
  EmailTemplate,
} from "../../../generated/prisma-client"
const nodemailer = require("nodemailer")

export const generateUserCourseProgress = async (
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
  let total_max_points: number = 0
  let total_n_points: number = 0
  progresses.map(entry => {
    entry.forEach(p => {
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
  if (course.automatic_completions && total_n_points >= course.points_needed) {
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
      sendMail(user, template)
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
  let testAccount = await nodemailer.createTestAccount()
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"mooc.fi" <noreply@mooc.fi>', // sender address
    to: user.email, // list of receivers
    subject: template.title, // Subject line
    text: template.txt_body, // plain text body
    html: template.html_body, // html body
  })
  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
