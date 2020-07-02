import { PrismaClient, EmailDelivery } from "@prisma/client"
import { sendEmailTemplateToUser } from "./kafkaConsumer/userCourseProgressConsumer/generateUserCourseProgress"

const BATCH_SIZE = 100

const prisma = new PrismaClient()

const sendEmail = async (emailDelivery: EmailDelivery) => {
  const { user, email_template } =
    (await prisma.emailDelivery.findOne({
      where: { id: emailDelivery.id },
      select: {
        user: true,
        email_template: true,
      },
    })) ?? {}
  if (!email_template || !user) {
    // TODO: should this update the delivery with error?
    console.error("No email template or user found while sending email")
    return
  }

  /*const user = await prisma.email_delivery.findOne({ where: { id: emailDelivery.id } }).user_email_deliveryTouser()
  const emailTemplate = await prisma
    .email_delivery.findOne({ where: { id: emailDelivery.id } })
    .email_template_email_deliveryToemail_template()*/
  console.log(`Delivering email ${email_template.name} to ${user.email}`)
  try {
    await sendEmailTemplateToUser(user, email_template)
    console.log("Marking email as delivered")
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: { sent: true, error: false },
    })
  } catch (e) {
    console.error("Sending failed", e.message)
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: { error: true, error_message: e.message },
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
      console.log(
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
