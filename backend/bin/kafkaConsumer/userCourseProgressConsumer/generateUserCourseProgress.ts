require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import {
  UserCourseProgress,
  Course,
  User,
  UserCourseSettings,
  EmailTemplate,
  prisma,
  UserCourseServiceProgress,
} from "../../../generated/prisma-client"
import * as nodemailer from "nodemailer"
import { render } from "micromustache"
import SMTPTransport = require("nodemailer/lib/smtp-transport")

const email_host = process.env.SMTP_HOST
const email_user = process.env.SMTP_USER
const email_pass = process.env.SMTP_PASS
const email_port = process.env.SMTP_PORT
const email_from = process.env.SMTP_FROM

interface Props {
  user: User
  course: Course
  userCourseProgress: UserCourseProgress
}

interface ServiceProgressPartType {
  max_points: number
  n_points: number
  group: string
  progress: number
}

interface ServiceProgressType extends Array<ServiceProgressPartType> {
  [index: number]: ServiceProgressPartType
}

/******************************************************/

export const generateUserCourseProgress = async ({
  user,
  course,
  userCourseProgress,
}: Props) => {
  const combined = await GetCombinedUserCourseProgress(user, course)
  const userCourseSettings = await GetUserCourseSettings(user, course)
  await CheckCompletion(user, course, combined, userCourseSettings)
  await prisma.updateUserCourseProgress({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined.progress,
      max_points: combined.total_max_points,
      n_points: combined.total_n_points,
    },
  })
}

/******************************************************/

async function sendMail(user: User, template: EmailTemplate) {
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

const GetCombinedUserCourseProgress = async (
  user: User,
  course: Course,
): Promise<CombinedUserCourseProgress> => {
  /* Get UserCourseServiceProgresses */
  const userCourseServiceProgresses = await prisma.userCourseServiceProgresses({
    where: {
      user: { id: user?.id },
      course: { id: course?.id },
    },
  })

  /*
   * Get rid of everything we dont neeed. After this the array looks like this:
   * [(serviceProgress)[[part1],[part2], ...], (anotherServiceProgress)[part1], [part2], ...]
   * It is still 2-dimensional!
   */
  const progresses: ServiceProgressType[] = userCourseServiceProgresses.map(
    (entry: UserCourseServiceProgress) => entry.progress,
  )

  let combined: CombinedUserCourseProgress = new CombinedUserCourseProgress()
  progresses.forEach(entry => {
    entry.forEach((p: ServiceProgressPartType) => {
      combined.addProgress(p)
    })
  })

  return combined
}

const GetUserCourseSettings = async (
  user: User,
  course: Course,
): Promise<UserCourseSettings> => {
  let userCourseSettings: UserCourseSettings =
    (await prisma.userCourseSettingses({
      where: {
        user: user,
        course: course,
      },
    }))[0] || null

  if (!userCourseSettings) {
    const inheritCourse = await prisma
      .course({ id: course.id })
      .inherit_settings_from()
    if (inheritCourse) {
      userCourseSettings =
        (await prisma.userCourseSettingses({
          where: {
            user: user,
            course: inheritCourse,
          },
        }))[0] || null
    }
  }
  return userCourseSettings
}

const CheckCompletion = async (
  user: User,
  course: Course,
  combined: CombinedUserCourseProgress,
  userCourseSettings: UserCourseSettings,
) => {
  if (
    course.automatic_completions &&
    combined.total_n_points >= (course.points_needed ?? 9999999)
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
        await sendMail(user, template)
      }
    }
  }
}

class CombinedUserCourseProgress {
  public progress: ServiceProgressPartType[] = []
  public total_max_points = 0
  public total_n_points = 0

  public addProgress(newProgress: ServiceProgressPartType) {
    this.total_max_points += newProgress.max_points
    this.total_n_points += newProgress.n_points
    let index = this.groupIndex(newProgress.group)
    if (index < 0) this.progress.push(newProgress)
    else this.addToExistingProgress(newProgress, index)
  }

  private groupIndex(part: string) {
    for (let i = 0; i < this.progress.length; i++) {
      if (this.progress[i].group == part) return i
    }
    return -1
  }

  private addToExistingProgress(
    progress: ServiceProgressPartType,
    index: number,
  ) {
    this.progress[index].max_points += progress.max_points
    this.progress[index].n_points += progress.n_points
    this.progress[index].progress =
      this.progress[index].n_points / this.progress[index].max_points
  }
}
