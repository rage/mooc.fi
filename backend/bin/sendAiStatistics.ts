import { AI_SLACK_URL } from "../config"
import { languageInfo, LanguageInfo } from "../config/languageConfig"
import prisma from "../prisma"
import Knex from "../services/knex"
import sentryLogger from "./lib/logger"
import SlackPoster from "./lib/slackPoster"

const logger = sentryLogger({ service: "send-ai-statistics" })
const slackPoster: SlackPoster = new SlackPoster(logger)

const url: string | undefined = AI_SLACK_URL

if (!url) {
  throw "no AI_SLACK_URL env variable"
}

let data = { text: "" }

// languages used moved to /backend/config/languageConfig.ts

const getDataByLanguage = async (langInfo: LanguageInfo) => {
  const { language, completion_language, country, langName } = langInfo

  const totalByLang = await prisma.userCourseSetting.findMany({
    where: {
      language: language,
      course: { slug: "elements-of-ai" },
    },
  })
  const completionsByLang = await prisma.completion.findMany({
    where: {
      course: { slug: "elements-of-ai" },
      completion_language,
    },
  })
  const englishInLang = await prisma.userCourseSetting.findMany({
    where: {
      country,
      language: "en",
    },
  })
  const now = new Date()
  return `\`\`\`Stats ${now.getDate()}.${
    now.getMonth() + 1
  }.${now.getFullYear()}:

  1) ${totalByLang.length} registered students in the ${langName} version
  2) of these ${completionsByLang.length} have completed the course.
  3) ${
    englishInLang.length
  } people registered for the English course residing in ${country}.

  In total: ${totalByLang.length} + ${englishInLang.length} = ${
    totalByLang.length + englishInLang.length
  }\`\`\` `
}

// const getGlobalStats = async () => {
//   const totalUsers = await prisma.userCourseSettingses({
//     where: {
//       course: { slug: "elements-of-ai" },
//     },
//   })
//   const totalCompletions = await prisma.completions({
//     where: {
//       course: { slug: "elements-of-ai" },
//     },
//   })
//   const now = new Date()
//   return `\`\`\`Stats ${now.getDate()}.${now.getMonth() +
//     1}.${now.getFullYear()}:

//   1) ${totalUsers.length} registered students in all versions
//   2) of these ${totalCompletions.length} have completed the course.\`\`\` `
// }

const getGlobalStats = async (): Promise<string> => {
  const course = await Knex.select("id")
    .from("course")
    .where({ slug: "elements-of-ai" })
  const totalUsers = (
    await Knex.count() // FIXME: should this be distinct?
      .from("user_course_setting")
      .whereNotNull("language")
      .andWhere({ course_id: course[0].id })
  )[0].count
  const totalCompletions = (
    await Knex.count() // FIXME: should this be distinct?
      .from("completion")
      .whereNotNull("completion_language")
      .andWhere({ course_id: course[0].id })
  )[0].count
  const now = new Date()

  return `\`\`\`Stats ${now.getDate()}.${
    now.getMonth() + 1
  }.${now.getFullYear()}:
    1) ${totalUsers} registered students in all versions
    2) of these ${totalCompletions} have completed the course.\`\`\` `
}

const getGlobalStatsBAI = async (): Promise<string> => {
  const course = await Knex.select("id")
    .from("course")
    .where({ slug: "building-ai" })

  // FIXME: should this be distinct?
  const totalUsers = (
    await Knex.count()
      .from("user_course_setting")
      .where({ course_id: course[0].id })
  )[0].count

  // FIXME: should this be distinct?
  const totalCompletions = (
    await Knex.count().from("completion").where({ course_id: course[0].id })
  )[0].count

  // FIXME: should this be distinct?
  const beginnerCompletions = (
    await Knex.count()
      .from("completion")
      .where({ course_id: course[0].id })
      .andWhere({ tier: 1 })
  )[0].count

  // FIXME: should this be distinct?
  const intermediateCompletions = (
    await Knex.count()
      .from("completion")
      .where({ course_id: course[0].id })
      .andWhere({ tier: 2 })
  )[0].count

  // FIXME: should this be distinct?
  const advancedCompletions = (
    await Knex.count()
      .from("completion")
      .where({ course_id: course[0].id })
      .andWhere({ tier: 3 })
  )[0].count

  const now = new Date()

  return `
  \`\`\`Stats ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}:
      1) ${totalUsers} registered students
      2) ${beginnerCompletions} have completed the Beginner Tier
      3) ${intermediateCompletions} have completed the Intermediate Tier
      4) ${advancedCompletions} have completed the Advanced Tier
      5) ${totalCompletions} have completed Building AI.\`\`\`
      `
}

const post = async () => {
  logger.info("getting global intro stats")
  data.text = data.text.concat(await getGlobalStats())

  logger.info("getting data by language")

  // English a special case
  const langInfos = languageInfo.filter(
    (langInfo) => langInfo.language !== "en",
  )
  for (const langInfo of langInfos) {
    data.text = data.text.concat(await getDataByLanguage(langInfo))
  }

  logger.info("getting global Building AI stats")
  data.text = data.text.concat(await getGlobalStatsBAI())

  await slackPoster.post(url, data)
  Knex.destroy()

  process.exit(0)
}

post()
