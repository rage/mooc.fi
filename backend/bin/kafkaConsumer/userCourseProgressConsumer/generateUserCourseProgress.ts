require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import {
  UserCourseSettings,
  PrismaClient,
  User,
  Course,
  UserCourseProgress,
  EmailTemplate,
  UserCourseServiceProgress,
} from "@prisma/client"
import Knex from "../../../services/knex"
import * as nodemailer from "nodemailer"
import SMTPTransport = require("nodemailer/lib/smtp-transport")
import { EmailTemplater } from "../../../util/EmailTemplater/EmailTemplater"
import { pushMessageToClient, MessageType } from "../../../wsServer"

const prisma = new PrismaClient()

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
  await CheckCompletion(user, course, combined)
  await prisma.userCourseProgress.update({
    where: { id: userCourseProgress.id },
    data: {
      progress: combined.progress as any, // errors unless typed as any
      max_points: combined.total_max_points,
      n_points: combined.total_n_points,
    },
  })
}

/******************************************************/

export async function sendEmailTemplateToUser(
  user: User,
  template: EmailTemplate,
) {
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
    subject: template.title ?? undefined, // Subject line
    text: await ApplyTemplate(template, user), // plain text body
    html: template.html_body ?? undefined, // html body
  })
  console.log("Message sent: %s", info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

const ApplyTemplate = async (email_template: EmailTemplate, user: User) => {
  const templater = new EmailTemplater(email_template, user, prisma)
  return await templater.resolve()
}

const GetCombinedUserCourseProgress = async (
  user: User,
  course: Course,
): Promise<CombinedUserCourseProgress> => {
  /* Get UserCourseServiceProgresses */
  const userCourseServiceProgresses = await prisma.userCourseServiceProgress.findMany(
    {
      where: {
        user_id: user?.id,
        course_id: course?.id,
      },
    },
  )

  /*
   * Get rid of everything we dont neeed. After this the array looks like this:
   * [(serviceProgress)[[part1],[part2], ...], (anotherServiceProgress)[part1], [part2], ...]
   * It is still 2-dimensional!
   */
  const progresses: ServiceProgressType[] = userCourseServiceProgresses.map(
    (entry: UserCourseServiceProgress) => entry.progress as any, // type error otherwise
  )

  let combined: CombinedUserCourseProgress = new CombinedUserCourseProgress()
  progresses.forEach((entry) => {
    entry.forEach((p: ServiceProgressPartType) => {
      combined.addProgress(p)
    })
  })

  return combined
}

const CheckRequiredExerciseCompletions = async (
  user: User,
  course: Course,
): Promise<boolean> => {
  if (course.exercise_completions_needed) {
    const exercise_completions = await Knex("exercise_completion")
      .countDistinct("exercise_completion.exercise")
      .join("exercise", { "exercise_completion.exercise": "exercise.id" })
      .where("exercise.course", course.id)
      .andWhere("exercise_completion.user", user.id)
      .andWhere("exercise_completion.completed", true)
      .andWhereNot("exercise.max_points", 0)

    return exercise_completions[0].count >= course.exercise_completions_needed
  }
  return true
}

const GetUserCourseSettings = async (
  user: User,
  course: Course,
): Promise<UserCourseSettings> => {
  let userCourseSettings: UserCourseSettings =
    (
      await prisma.userCourseSettings.findMany({
        where: {
          user_id: user.id,
          course_id: course.id,
        },
      })
    )[0] || null

  if (!userCourseSettings) {
    const inheritCourse = await prisma.course
      .findOne({ where: { id: course.id } })
      .inherit_settings_from()
    if (inheritCourse) {
      userCourseSettings =
        (
          await prisma.userCourseSettings.findMany({
            where: {
              user_id: user.id,
              course_id: inheritCourse.id,
            },
          })
        )[0] || null
    }
  }
  return userCourseSettings
}

const languageCodeMapping: { [key: string]: string } = {
  fi: "fi_FI",
  en: "en_US",
  se: "sv_SE",
  ee: "et_EE",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  hu: "hu_HU",
  lv: "lv_LV",
  da: "da_DK",
  nl: "nl_NL",
  hr: "hr_HR",
  lt: "lt_LT",
  ga: "ga_IE",
  bg: "bg_BG",
  cs: "cs_CZ",
  el: "el_GR",
  mt: "mt_MT",
  pt: "pt_PT",
  ro: "ro_RO",
  sk: "sk_SK",
  sl: "sl_SI",
  no: "nb_NO",
}

export const CheckCompletion = async (
  user: User,
  course: Course,
  combinedProgress?: CombinedUserCourseProgress,
) => {
  let combined = combinedProgress

  if (!combined) {
    combined = await GetCombinedUserCourseProgress(user, course)
  }

  const requiredExerciseCompletions = await CheckRequiredExerciseCompletions(
    user,
    course,
  )
  const userCourseSettings = await GetUserCourseSettings(user, course)

  if (
    course.automatic_completions &&
    combined.total_n_points >= (course.points_needed ?? 9999999) &&
    requiredExerciseCompletions
  ) {
    let handlerCourse = course

    const otherHandlerCourse = await prisma.course
      .findOne({ where: { id: course.id } })
      .completions_handled_by()

    if (otherHandlerCourse) {
      handlerCourse = otherHandlerCourse
    }

    const completions = await prisma.completion.findMany({
      where: {
        user_id: user.id,
        course_id: handlerCourse?.id,
      },
    })
    if (completions.length < 1) {
      await prisma.completion.create({
        data: {
          course: { connect: { id: handlerCourse.id } },
          email: user.email,
          user: { connect: { id: user.id } },
          user_upstream_id: user.upstream_id,
          student_number: user.student_number,
          completion_language: userCourseSettings?.language
            ? languageCodeMapping[userCourseSettings.language]
            : "unknown",
          eligible_for_ects:
            handlerCourse.automatic_completions_eligible_for_ects,
        },
      })
      pushMessageToClient(
        user.upstream_id,
        course.id,
        MessageType.COURSE_CONFIRMED,
      )
      const template = await prisma.course
        .findOne({ where: { id: course.id } })
        .completion_email()
      if (template) {
        await sendEmailTemplateToUser(user, template)
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
    if (index < 0) {
      this.progress.push(newProgress)
    } else {
      this.addToExistingProgress(newProgress, index)
    }
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
