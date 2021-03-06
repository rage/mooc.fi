import { EmailDelivery } from "@prisma/client"
import { sendEmailTemplateToUser } from "./kafkaConsumer/common/EmailTemplater/sendEmailTemplate"
import prisma from "../prisma"
import sentryLogger from "./lib/logger"
import { EmailTemplaterError } from "./lib/errors"

const BATCH_SIZE = 100

const logger = sentryLogger({ service: "background-emailer" })

const sendEmail = async (emailDelivery: EmailDelivery) => {
  const { user, email_template } =
    (await prisma.emailDelivery.findUnique({
      where: { id: emailDelivery.id },
      select: {
        user: true,
        email_template: true,
      },
    })) ?? {}
  if (!email_template || !user) {
    // TODO: should this update the delivery with error?
    logger.error(
      new EmailTemplaterError(
        "No email template or user found while sending email",
      ),
    )
    return
  }

  /*const user = await prisma.email_delivery.findOne({ where: { id: emailDelivery.id } }).user_email_deliveryTouser()
  const emailTemplate = await prisma
    .email_delivery.findOne({ where: { id: emailDelivery.id } })
    .email_template_email_deliveryToemail_template()*/
  logger.info(`Delivering email ${email_template.name} to ${user.email}`)

  try {
    await sendEmailTemplateToUser(user, email_template)
    logger.info("Marking email as delivered")
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: {
        sent: { set: true },
        error: { set: false },
      },
    })
  } catch (e) {
    logger.error(new EmailTemplaterError("Sending failed", e))
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: {
        error: { set: true },
        error_message: e.message,
      },
    })
  }
}

const main = async () => {
  while (true) {
    const emailsToDeliver = await prisma.emailDelivery.findMany({
      where: { sent: false, error: false },
      take: BATCH_SIZE,
    })
    if (emailsToDeliver.length > 0) {
      logger.info(
        `Received a batch of ${emailsToDeliver.length} emails to send.`,
      )
    }
    // No parallelism for now so that we don't accidentally bump into sending limits
    for (const emailDelivery of emailsToDeliver) {
      await sendEmail(emailDelivery)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

main()
