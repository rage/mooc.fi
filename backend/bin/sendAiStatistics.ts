import { AI_SLACK_URL } from "../config"
import { languageInfo, LanguageInfo } from "../config/languageConfig"
import sentryLogger from "../lib/logger"
import SlackPoster from "../lib/slackPoster"
import prisma from "../prisma"
import Knex from "../services/knex"

const logger = sentryLogger({ service: "send-ai-statistics" })
const slackPoster: SlackPoster = new SlackPoster(logger)

const url: string | undefined = AI_SLACK_URL

if (!url) {
  throw new Error("no AI_SLACK_URL env variable")
}

const data = { text: "" }

// languages used moved to /backend/config/languageConfig.ts

const getDataByLanguage = async (langInfo: LanguageInfo) => {
  const { language, completion_language, country, langName } = langInfo

  const totalByLang = await prisma.course
    .findUnique({
      where: { slug: "elements-of-ai" },
    })
    .user_course_settings({
      where: {
        language: language,
      },
      distinct: ["user_id"],
    })
  const completionsByLang = await prisma.course
    .findUnique({
      where: { slug: "elements-of-ai" },
    })
    .completions({
      where: {
        completion_language,
      },
      distinct: ["user_id"],
    })
  const englishInLang = await prisma.course
    .findUnique({
      where: { slug: "elements-of-ai" },
    })
    .user_course_settings({
      where: {
        country,
        language: "en",
      },
      distinct: ["user_id"],
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
    await Knex.countDistinct("user_id")
      .from("user_course_setting")
      .whereNotNull("language")
      .andWhere({ course_id: course[0].id })
  )[0].count
  const totalCompletions = (
    await Knex.countDistinct("user_id")
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

  const totalUsers = (
    await Knex.countDistinct("user_id")
      .from("user_course_setting")
      .where({ course_id: course[0].id })
  )[0].count

  const totalCompletions = (
    await Knex.countDistinct("user_id")
      .from("completion")
      .where({ course_id: course[0].id })
  )[0].count

  const beginnerCompletions = (
    await Knex.countDistinct("user_id")
      .from("completion")
      .where({ course_id: course[0].id })
      .andWhere({ tier: 1 })
  )[0].count

  const intermediateCompletions = (
    await Knex.countDistinct("user_id")
      .from("completion")
      .where({ course_id: course[0].id })
      .andWhere({ tier: 2 })
  )[0].count

  const advancedCompletions = (
    await Knex.countDistinct("user_id")
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
