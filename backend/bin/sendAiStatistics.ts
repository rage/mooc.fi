import SlackPoster from "../services/slackPoster"
import { Prisma, UserCourseSettings } from "../generated/prisma-client"

const slackPoster: SlackPoster = new SlackPoster()
const url: string =
  "https://hooks.slack.com/services/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"
const data = { text: "Hello! This is a test!" }
const prisma: Prisma = new Prisma()

const post = async () => {
  const totalSwedish: UserCourseSettings[] = await prisma.userCourseSettingses({
    where: {
      language: "se",
    },
  })
  let totalSwedishCompletedCount = 0
  for (let i = 0; i < totalSwedish.length; i++) {
    const exists = await prisma.$exists.completion({})
  }

  slackPoster.post(url, data)
}

post()
