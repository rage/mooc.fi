require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import SlackPoster from "../services/slackPoster"
import { Prisma, UserCourseSettings, User } from "../generated/prisma-client"

const slackPoster: SlackPoster = new SlackPoster()
const url: string =
  "https://hooks.slack.com/services/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"
let data = { text: "Hello! This is a test!" }
const prisma: Prisma = new Prisma()

const post = async () => {
  const totalSwedish: UserCourseSettings[] = await prisma.userCourseSettingses({
    where: {
      language: "se",
    },
  })
  let totalSwedishCompletedCount = 0
  for (let i = 0; i < totalSwedish.length; i++) {
    const user: User = await prisma
      .userCourseSettings({ id: totalSwedish[i].id })
      .user()
    const exists = await prisma.$exists.completion({
      user: user,
      course: { slug: "elements-of-ai" },
    })
    if (exists) totalSwedishCompletedCount++
  }
  const englishInSwedish = await prisma.userCourseSettingses({
    where: {
      country: "Sweden",
      language: "en",
    },
  })
  const now = new Date()
  console.log(+now)
  data.text = `\`\`\`Stats ${now.getDate()}.${now.getMonth() +
    1}.${now.getFullYear()}:
 
  1) ${totalSwedish.length} registered students in the Swedish version
  2) of these ${totalSwedishCompletedCount} have completed the course.
  3) ${
    englishInSwedish.length
  } people registered for the English course residing in Sweden.
  
  In total: ${totalSwedish.length} + ${
    englishInSwedish.length
  } = ${totalSwedish.length + englishInSwedish.length}\`\`\``

  slackPoster.post(url, data)
}

post()
