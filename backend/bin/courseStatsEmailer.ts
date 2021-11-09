import prisma from "../prisma"

const courseStatsEmailer = async () => {
  const subscriptions = await prisma.courseStatsSubscription.findMany({})

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
