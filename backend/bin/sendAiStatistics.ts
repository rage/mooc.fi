require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import SlackPoster from "./lib/slackPoster"
import Knex from "../services/knex"
import prismaClient from "./lib/prisma"
import sentryLogger from "./lib/logger"

const logger = sentryLogger({ service: "send-ai-statistics" })
const slackPoster: SlackPoster = new SlackPoster(logger)

const url: string | undefined = process.env.AI_SLACK_URL

if (!url) {
  throw "no AI_SLACK_URL env variable"
}

let data = { text: "" }
const prisma = prismaClient()

interface langProps {
  language: string
  completion_language: string
  country: string
  langName: string
}

const langArr: langProps[] = [
  {
    language: "se",
    completion_language: "sv_SE",
    country: "Sweden",
    langName: "Swedish",
  },
  {
    language: "fi",
    completion_language: "fi_FI",
    country: "Finland",
    langName: "Finnish",
  },
  {
    language: "ee",
    completion_language: "et_EE",
    country: "Estonia",
    langName: "Estonian",
  },
  {
    language: "de",
    completion_language: "de_DE",
    country: "Germany",
    langName: "German",
  },
  {
    language: "no",
    completion_language: "nb_NO",
    country: "Norway",
    langName: "Norwegian",
  },
  {
    language: "lv",
    completion_language: "lv_LV",
    country: "Latvia",
    langName: "Latvian",
  },
]

const getDataByLanguage = async (langProps: langProps) => {
  const totalByLang = await prisma.userCourseSetting.findMany({
    where: {
      language: langProps.language,
      course: { slug: "elements-of-ai" },
    },
  })
  const completionsByLang = await prisma.completion.findMany({
    where: {
      course: { slug: "elements-of-ai" },
      completion_language: langProps.completion_language,
    },
  })
  const englishInLang = await prisma.userCourseSetting.findMany({
    where: {
      country: langProps.country,
      language: "en",
    },
  })
  const now = new Date()
  return `\`\`\`Stats ${now.getDate()}.${
    now.getMonth() + 1
  }.${now.getFullYear()}:

  1) ${totalByLang.length} registered students in the ${
    langProps.langName
  } version
  2) of these ${completionsByLang.length} have completed the course.
  3) ${
    englishInLang.length
  } people registered for the English course residing in ${langProps.country}.

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
    await Knex.count()
      .from("user_course_setting")
      .where({ course_id: course[0].id })
  )[0].count
  const totalCompletions = (
    await Knex.count().from("completion").where({ course_id: course[0].id })
  )[0].count
  const now = new Date()

  return `\`\`\`Stats ${now.getDate()}.${
    now.getMonth() + 1
  }.${now.getFullYear()}:
    1) ${totalUsers} registered students in all versions
    2) of these ${totalCompletions} have completed the course.\`\`\` `
}

const post = async () => {
  data.text = data.text.concat(await getGlobalStats())
  for (let i = 0; i < langArr.length; i++) {
    data.text = data.text.concat(await getDataByLanguage(langArr[i]))
  }
  await slackPoster.post(url, data)
  Knex.destroy()

  process.exit(0)
}

post()
