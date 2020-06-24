require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

import { PrismaClient, user } from "@prisma/client"

const prisma = new PrismaClient()
const getPassedUsernamesByTag = require("../services/quiznator")
  .getPassedUsernamesByTag
const tmcService = require("../services/tmc_completion_script")

const elementsOfAiTags = [
  "elements-of-ai",
  "elements-of-ai-fi",
  "elements-of-ai-se",
  "elements-of-ai-ee",
  "elements-of-ai-de",
]

export default async function fetchCompletions() {
  const startTime = new Date().getTime()
  await getElementsOfAiInfo()
  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "time")
}

async function getElementsOfAiInfo() {
  const promises = elementsOfAiTags.map(async (tag) => {
    let usernames = await getPassedUsernamesByTag(tag)
    console.log(
      `Got passed students from quiznator! ${usernames.length} students have passed ${tag} so far.`,
    )
    usernames = await removeDataThatIsInDBAlready(usernames, "elements-of-ai")
    let basicInfo = await tmcService.getBasicInfoByUsernames(usernames)
    console.log(`Got info from ${basicInfo.length} ${tag} students`)
    await saveCompletionsAndUsersToDatabase(basicInfo, "elements-of-ai", tag)
  })
  await Promise.all(promises)
}

async function removeDataThatIsInDBAlready(
  data: string[],
  course_slug: string,
) {
  const users = await prisma.user.findMany({
    where: {
      AND: {
        username: { in: data },
        completion: {
          some: { course_completionTocourse: { slug: course_slug } },
        },
      },
    },
  })
  const usernames = users.map((user) => user.username)
  return data.filter((entry) => {
    return !usernames.includes(entry)
  })
}

async function saveCompletionsAndUsersToDatabase(
  data: any[],
  course_slug: string,
  course_name: string,
) {
  console.log("starting with", course_name)
  for (let i = 0; i < data.length; i++) {
    let old = data[i]
    if (!old.id) console.log(old)
    let user: user | null = await prisma.user.findOne({
      where: { upstream_id: old.id },
    })

    if (!user) {
      const prismaDetails = {
        upstream_id: old.id,
        first_name: old.first_name,
        last_name: old.last_name,
        username: old.username,
        email: old.email,
        administrator: old.administrator,
        student_number: old.student_number,
      }
      user = await prisma.user.upsert({
        where: { upstream_id: old.id },
        create: prismaDetails,
        update: prismaDetails,
      })
    }

    const course = await prisma.course.findOne({ where: { slug: course_slug } })

    if (!course) {
      process.exit(1)
    }

    const doesCompletionExists = await prisma.completion.findMany({
      where: {
        user: user.id,
        course: course.id,
      },
    })

    if (!doesCompletionExists.length) {
      await prisma.completion.create({
        data: {
          user_completionTouser: { connect: { upstream_id: user.upstream_id } },
          course_completionTocourse: { connect: { id: course.id } },
          completion_language: determineCompletionLanguage(course_name),
          user_upstream_id: user.upstream_id,
          email: user.email,
          student_number: user.student_number,
        },
      })
    }
  }
}

function determineCompletionLanguage(tag: string): string {
  switch (tag) {
    case "elements-of-ai":
      return "en_US"
    case "elements-of-ai-fi":
      return "fi_FI"
    case "elements-of-ai-se":
      return "sv_SE"
    case "elements-of-ai-ee":
      return "et_EE"
    case "elements-of-ai-de":
      return "de_DE"
    default:
      return "undefined"
  }
}

fetchCompletions()
