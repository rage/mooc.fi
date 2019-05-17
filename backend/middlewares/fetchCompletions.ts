require("dotenv-safe").config();
import { prisma, Prisma, Int, User, Course, OpenUniversityCourse, Completion } from "../generated/prisma-client";
import { POINT_CONVERSION_COMPRESSED } from "constants";
const getPassedUsernamesByTag = require("../services/quiznator")
  .getPassedUsernamesByTag;
const tmcService = require("../services/tmc_completion_script");
const { UserInputError } = require('apollo-server-core')



const elementsOfAiTags = ["elements-of-ai", "elements-of-ai-fi", "elements-of-ai-se"];


export default async function fetchCompletions(course, ctx): Promise<Completion[]> {
  
  if (course == "elements-of-ai") {
    await getElementsOfAiInfo(ctx)
  } else {
    await getCourseInfo(course, ctx)
  }
  const startTime = new Date().getTime()
  const data = await getCompletionDataFromDB(course, ctx)
  console.log("FINISHED WITH", course)
  const stopTime = new Date().getTime()
  console.log("used", stopTime-startTime, "time")
  return data
}


async function getCourseInfo(course, ctx) {
  let basicInfo
  const promise = async course => {
    let usernames = await getPassedUsernamesByTag(course)
    console.log(
      `Got passed students from quiznator! ${
      usernames.length
      } students have passed ${course} so far.`
    )
    usernames = await removeDataThatIsInDBAlready(usernames, ctx)
    basicInfo = await tmcService.getBasicInfoByUsernames(usernames);
    console.log(`Got info from ${basicInfo.length} ${course} students`);
    await saveCompletionsAndUsersToDatabase(basicInfo, course, ctx, course)

  }
  await Promise.apply(promise)
}

async function getElementsOfAiInfo(ctx) {
  let tagsToInfo = [];
  const promises = elementsOfAiTags.map(async tag => {
    let usernames = await getPassedUsernamesByTag(tag);
    console.log(
      `Got passed students from quiznator! ${
      usernames.length
      } students have passed ${tag} so far.`
    );
    usernames = await removeDataThatIsInDBAlready(usernames, ctx)
    let basicInfo = await tmcService.getBasicInfoByUsernames(usernames);
    console.log(`Got info from ${basicInfo.length} ${tag} students`);
    await saveCompletionsAndUsersToDatabase(basicInfo, "elements-of-ai",ctx,  tag,)

    tagsToInfo.push(...basicInfo)
  });
  await Promise.all(promises);
}

async function getCompletionDataFromDB(course_slug : string, ctx): Promise<Completion[]> {
  const prisma : Prisma = ctx.prisma
  const course : Course = await prisma.course({slug: course_slug})

  return prisma.completions({where: {course: course}})
}

async function removeDataThatIsInDBAlready(data : string[], ctx) {
  const prisma : Prisma = ctx.prisma
  const users : User[] = await prisma.users({
    where: {
      username_in: data
    }
  })
  const usernames = users.map(user => user.username)
  return data.filter((entry) => {
    return !usernames.includes(entry)
  })
}

async function parseCompletions(completions, tag) {
  let parsed = []
  for (let i = 0; i < completions.length; i++) {
    let completion = {}
    let old = completions[i]
    completion["id"] = old.id
    completion["email"] = old.email
    completion["username"] = old.username
    completion["student_number"] = old.student_number
    completion["first_name"] = old.first_name
    completion["last_name"] = old.last_name
    completion["completion_language"] = determineCompletionLanguage(tag)
    parsed.push(completion)
  }
  return parsed
}

async function saveCompletionsAndUsersToDatabase(data: any[], course_slug, ctx,  course_name_for_debug) {
  const prisma : Prisma = ctx.prisma
  console.log('starting with', course_name_for_debug)
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
        student_number: old.student_number
      }
      user = await prisma.upsertUser({
        where: { upstream_id: old.id },
        create: prismaDetails,
        update: prismaDetails
      })
    }
    const course: Course = await prisma.course({ slug: course_slug })
    const doesCompletionExists: Completion[] = await prisma.completions({
      where: { user: user, course: course }
    })
    if (!doesCompletionExists.length) {
      const completion: Completion = await prisma.createCompletion({
        user: { connect: { upstream_id: user.upstream_id } },
        course: { connect: { id: course.id } },
        completion_language: determineCompletionLanguage(course_name_for_debug),
        user_upstream_id: user.upstream_id,
        email: user.email,
        student_number: user.student_number
      })
    }
  }


}


function determineCompletionLanguage(tag): string {
  switch (tag) {
    case "elements-of-ai":
      return "en_us"
    case "elements-of-ai-fi":
      return "fi_fi"
    case "elements-of-ai-se":
      return "sv_SE"
    default:
      return "undefined"
  }
}

