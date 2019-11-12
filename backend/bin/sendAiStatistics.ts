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

let data = { text: "Hello! This is a test!" }
const prisma: Prisma = new Prisma()

const post = async () => {
  const totalSwedish: UserCourseSettings[] = await prisma.userCourseSettingses({
    where: {
      language: "se",
    },
  })
  const swedishCompletions: Completion[] = await prisma.completions({
    where: {
      course: { slug: "elements-of-ai" },
      completion_language: "sv_SE",
    },
  })
  const englishInSwedish = await prisma.userCourseSettingses({
    where: {
      country: "Sweden",
      language: "en",
    },
  })
  const now = new Date()
  data.text = `\`\`\`Stats ${now.getDate()}.${now.getMonth() +
    1}.${now.getFullYear()}:
 
  1) ${totalSwedish.length} registered students in the Swedish version
  2) of these ${swedishCompletions.length} have completed the course.
  3) ${
    englishInSwedish.length
  } people registered for the English course residing in Sweden.
  
  In total: ${totalSwedish.length} + ${
    englishInSwedish.length
  } = ${totalSwedish.length + englishInSwedish.length}\`\`\``

  slackPoster.post(url, data)
}

post()
