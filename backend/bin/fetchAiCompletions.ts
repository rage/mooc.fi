require("dotenv-safe").config()
import { prisma, User, Course, Completion } from "../generated/prisma-client"
const getPassedUsernamesByTag = require("../services/quiznator")
  .getPassedUsernamesByTag
const tmcService = require("../services/tmc_completion_script")

const elementsOfAiTags = [
  "elements-of-ai",
  "elements-of-ai-fi",
  "elements-of-ai-se",
]

export default async function fetchCompletions() {
  const startTime = new Date().getTime()
  await getElementsOfAiInfo()
  const stopTime = new Date().getTime()
  console.log("used", stopTime - startTime, "time")
}

async function getElementsOfAiInfo() {
  const promises = elementsOfAiTags.map(async tag => {
    let usernames = await getPassedUsernamesByTag(tag)
    console.log(
      `Got passed students from quiznator! ${
        usernames.length
      } students have passed ${tag} so far.`,
    )
    usernames = await removeDataThatIsInDBAlready(usernames)
    let basicInfo = await tmcService.getBasicInfoByUsernames(usernames)
    console.log(`Got info from ${basicInfo.length} ${tag} students`)
    await saveCompletionsAndUsersToDatabase(basicInfo, "elements-of-ai", tag)
  })
  await Promise.all(promises)
}

async function removeDataThatIsInDBAlready(data: string[]) {
  const users: User[] = await prisma.users({
    where: {
      username_in: data,
    },
  })
  const usernames = users.map(user => user.username)
  return data.filter(entry => {
    return !usernames.includes(entry)
  })
}

async function saveCompletionsAndUsersToDatabase(
  data: any[],
  course_slug,
  course_name,
) {
  console.log("starting with", course_name)
  for (let i = 0; i < data.length; i++) {
    let old = data[i]
    if (!old.id) console.log(old)
    let user: User = await prisma.user({ upstream_id: old.id })
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
      user = await prisma.upsertUser({
        where: { upstream_id: old.id },
        create: prismaDetails,
        update: prismaDetails,
      })
    }
    const course: Course = await prisma.course({ slug: course_slug })
    const doesCompletionExists: Completion[] = await prisma.completions({
      where: { user: user, course: course },
    })
    if (!doesCompletionExists.length) {
      await prisma.createCompletion({
        user: { connect: { upstream_id: user.upstream_id } },
        course: { connect: { id: course.id } },
        completion_language: determineCompletionLanguage(course_name),
        user_upstream_id: user.upstream_id,
        email: user.email,
        student_number: user.student_number,
      })
    }
  }
}

function determineCompletionLanguage(tag): string {
  switch (tag) {
    case "elements-of-ai":
      return "en_US"
    case "elements-of-ai-fi":
      return "fi_FI"
    case "elements-of-ai-se":
      return "sv_SE"
    default:
      return "undefined"
  }
}

fetchCompletions()
