import sentryLogger from "../lib/logger"
import prisma from "../prisma"

// TODO/FIXME:
// come to think of it, is this really necessary if we check the expires_at against the server date anyway?

const logger = sentryLogger({
  service: "expire-user-organization-join-confirmations",
})

const expireUserOrganizationJoinConfirmations = async () => {
  while (true) {
    const now = new Date()

    const userOrganizationJoinConfirmations =
      await prisma.userOrganizationJoinConfirmation.findMany({
        where: {
          expired: { not: true },
          expires_at: { lte: now },
        },
        include: {
          email_delivery: true,
        },
      })

    if (userOrganizationJoinConfirmations.length > 0) {
      logger.info(
        `Found ${userOrganizationJoinConfirmations.length} user organization join confirmations to expire.`,
      )

      let undeliveredMails = 0

      for (const userOrganizationJoinConfirmation of userOrganizationJoinConfirmations) {
        await prisma.userOrganizationJoinConfirmation.update({
          where: { id: userOrganizationJoinConfirmation.id },
          data: {
            expired: { set: true },
          },
        })

        const { email_delivery } = userOrganizationJoinConfirmation

        if (!email_delivery) {
          logger.warn(
            `No email delivery found for user organization join confirmation ${userOrganizationJoinConfirmation.id} that has expired`,
          )
        } else if (!email_delivery.sent) {
          await prisma.emailDelivery.update({
            where: { id: email_delivery.id },
            data: {
              error: { set: true },
              error_message: `User organization join confirmation expired by cronjob at ${new Date(
                now,
              )}`,
            },
          })

          undeliveredMails++
        }
      }

      if (undeliveredMails > 0) {
        logger.warn(
          `Found ${undeliveredMails} undelivered email deliveries for user organization join confirmations that expired`,
        )
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 60 * 1000)) // minute
  }
}

expireUserOrganizationJoinConfirmations()
