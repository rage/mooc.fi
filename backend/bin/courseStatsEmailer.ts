import sentryLogger from "../lib/logger"
import prisma from "../prisma"

const logger = sentryLogger({ service: "course-stats-emailer" })

const courseStatsEmailer = async () => {
  const subscriptions = await prisma.courseStatsSubscription.findMany({})

  logger.info(`Found ${subscriptions.length} subscriptions`)

  for (const subscription of subscriptions) {
    await prisma.emailDelivery.create({
      data: {
        user_id: subscription.user_id,
        email_template_id: subscription.email_template_id,
        sent: false,
        error: false,
      },
    })
  }
}

courseStatsEmailer()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((error) => {
    logger.error(error)

    return prisma.$disconnect().then(() => process.exit(1))
  })
