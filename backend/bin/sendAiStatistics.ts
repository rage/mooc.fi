require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import SlackPoster from "../services/slackPoster"
import {
  Prisma,
  UserCourseSettings,
  Completion,
} from "../generated/prisma-client"

const slackPoster: SlackPoster = new SlackPoster()
const url: string | undefined = process.env.AI_SLACK_URL

if (!url) {
  throw "no AI_SLACK_URL env variable"
}

let data = { text: "" }
const prisma: Prisma = new Prisma()

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
]

const getDataByLanguage = async (langProps: langProps) => {
  const totalByLang: UserCourseSettings[] = await prisma.userCourseSettingses({
    where: {
      language: langProps.language,
      course: { slug: "elements-of-ai" },
    },
  })
  const completionsByLang: Completion[] = await prisma.completions({
    where: {
      course: { slug: "elements-of-ai" },
      completion_language: langProps.completion_language,
    },
  })
  const englishInLang = await prisma.userCourseSettingses({
    where: {
      country: langProps.country,
      language: "en",
    },
  })
  const now = new Date()
  return `\`\`\`Stats ${now.getDate()}.${now.getMonth() +
    1}.${now.getFullYear()}:
 
  1) ${totalByLang.length} registered students in the ${
    langProps.langName
  } version
  2) of these ${completionsByLang.length} have completed the course.
  3) ${
    englishInLang.length
  } people registered for the English course residing in ${langProps.country}.
  
  In total: ${totalByLang.length} + ${
    englishInLang.length
  } = ${totalByLang.length + englishInLang.length}\`\`\` `
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

const post = async () => {
  //data.text = data.text.concat(await getGlobalStats())
  for (let i = 0; i < langArr.length; i++) {
    data.text = data.text.concat(await getDataByLanguage(langArr[i]))
  }
  slackPoster.post(url, data)
}

post()
