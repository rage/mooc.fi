require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import {
  UserCourseSetting,
  User,
  Course,
  UserCourseProgress,
  EmailTemplate,
  UserCourseServiceProgress,
} from "@prisma/client"
import Knex from "../../../services/knex"
import * as nodemailer from "nodemailer"
import SMTPTransport = require("nodemailer/lib/smtp-transport")
import { EmailTemplater } from "../common/EmailTemplater/EmailTemplater"
import { pushMessageToClient, MessageType } from "../../../wsServer"
import prismaClient from "../../lib/prisma"
import { range } from "lodash"
import { BAIexercises, BAItiers, requiredByTier } from "./courseConfig"

const prisma = prismaClient()

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

  let combined = new CombinedUserCourseProgress()
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
      .countDistinct("exercise_completion.exercise_id")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", course.id)
      .andWhere("exercise_completion.user_id", user.id)
      .andWhere("exercise_completion.completed", true)
      .andWhereNot("exercise.max_points", 0)

    return exercise_completions[0].count >= course.exercise_completions_needed
  }
  return true
}

interface ExerciseCompletionPart {
  course_id: string
  exercise_id: string
  max_points?: number
  n_points?: number
}

const getExerciseCompletionsForCourses = async (
  user: User,
  courses: Course[],
) => {
  const exercise_completions: ExerciseCompletionPart[] = await Knex<
    any,
    ExerciseCompletionPart[]
  >("exercise_completion")
    .select(
      "exercise.course_id",
      "exercise.max_points",
      "exercise_completion.exercise_id",
      "exercise_completion.n_points",
    )
    .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
    .whereIn(
      "exercise.course_id",
      courses.map((c) => c.id),
    )
    .andWhere("exercise_completion.user_id", user.id)
    .andWhere("exercise_completion.completed", true)
    .andWhereNot("exercise.max_points", 0)

  /*const result: Record<string, string[]> = exercise_completions.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.course_id]: (acc[curr.course_id] ?? []).concat(curr.exercise_id),
    }),
    {},
  )*/

  /*
    [{ course_id, exercise_id, max_points, n_points }, ...] 
   */
  return exercise_completions
}

const GetUserCourseSettings = async (
  user: User,
  course: Course,
): Promise<UserCourseSetting> => {
  let userCourseSetting: UserCourseSetting =
    (
      await prisma.userCourseSetting.findMany({
        where: {
          user_id: user.id,
          course_id: course.id,
        },
      })
    )?.[0] || null

  if (!userCourseSetting) {
    const inheritCourse = await prisma.course
      .findOne({ where: { id: course.id } })
      .inherit_settings_from()
    if (inheritCourse) {
      userCourseSetting =
        (
          await prisma.userCourseSetting.findMany({
            where: {
              user_id: user.id,
              course_id: inheritCourse.id,
            },
          })
        )[0] || null
    }
  }
  return userCourseSetting
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

export const checkBAICompletion = async (
  user: User,
  course: Course,
  combinedProgress?: CombinedUserCourseProgress, // this is for the tier course we got
) => {
  const handlerCourse = await prisma.course
    .findOne({ where: { id: course.id } })
    .completions_handled_by()

  if (!handlerCourse) {
    // TODO: error
    return
  }

  // this is not needed if we hard code the course ids, as the function it's
  // passed to only needs the ids
  const tierCourses = await prisma.course
    .findOne({ where: { id: handlerCourse.id } })
    .handles_completions_for()

  const exerciseCompletionsForCourses = await getExerciseCompletionsForCourses(
    user,
    tierCourses,
  )
  /*
    [{ course_id, exercise_id, n_points }...] for all the tiers
  */

  const highestTiersAndPoints = exerciseCompletionsForCourses.reduce(
    (acc, curr) => {
      const exercise = BAIexercises[curr.exercise_id]

      if (!exercise) return acc

      return {
        ...acc,
        [exercise.exercise]: {
          tier: Math.max(acc[exercise.exercise]?.tier ?? 0, exercise.tier),
          max_points: curr.max_points ?? 0,
          n_points: Math.max(
            acc[exercise.exercise]?.n_points ?? 0,
            curr.n_points ?? 0,
          ),
        },
      }
    },
    {} as Record<
      number,
      { tier: number; max_points: number; n_points: number }
    >,
  )
  /*
    [exercise #]: { tier, n_points, max_points } -- what's the maximum tier completed and 
      what's the highest amount of points received, not necessarily from maximum tier 
    ...
  */

  const totalPoints = Object.values(highestTiersAndPoints).reduce(
    (acc, curr) => acc + curr.n_points / (curr.max_points || 1),
    0,
  )

  const hasEnoughPoints =
    totalPoints >= (handlerCourse.points_needed ?? 9999999)
  const hasEnoughExerciseCompletions =
    Object.keys(highestTiersAndPoints).length >
    (handlerCourse.exercise_completions_needed ?? 0)
  const hasBasicRule = hasEnoughPoints && hasEnoughExerciseCompletions

  const tierCompletions = range(1, 4).reduce(
    (acc, tier) => ({
      ...acc,
      [tier]: Object.values(highestTiersAndPoints).filter((t) => t.tier >= tier)
        .length,
    }),
    {} as Record<number, number>,
  )
  /*
    [tier #]: # of exercises completed from _at least_ this tier,
      so tier 3 is counted in both 1 and 2, and so on 
  */
  const hasTier = {
    1: hasBasicRule,
    2: hasBasicRule && tierCompletions[2] >= requiredByTier[2],
    3: hasBasicRule && tierCompletions[3] >= requiredByTier[3],
  }

  const missingFromTier = range(1, 4).reduce(
    (acc, tier) => ({
      ...acc,
      [tier]: Math.max(0, requiredByTier[tier] - tierCompletions[tier]),
    }),
    {} as Record<number, number>,
  )
  /* 
    [tier #]: how many exercises missing to get to this tier
  */

  const highestTier = Object.entries(hasTier).reduce(
    (acc, [tier, has]) => (has ? Math.max(acc, Number(tier)) : acc),
    0,
  )

  // todo: create and update handler course progress

  if (highestTier < 1) {
    return
  }

  const completions = await prisma.completion.findMany({
    where: {
      user_id: user.id,
      course_id: BAItiers[highestTier],
    },
  })

  if (completions.length < 1) {
    const userCourseSettings = await GetUserCourseSettings(user, course)
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
        completion_date: new Date(),
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

export const CheckCompletion = async (
  user: User,
  course: Course,
  combinedProgress?: CombinedUserCourseProgress,
) => {
  let combined = combinedProgress

  if (!combined) {
    combined = await GetCombinedUserCourseProgress(user, course)
  }

  // branch here?

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
          completion_date: new Date(),
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
