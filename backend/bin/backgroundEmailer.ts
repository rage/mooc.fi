import { PrismaClient, email_delivery } from "@prisma/client"
import { sendEmailTemplateToUser } from "./kafkaConsumer/userCourseProgressConsumer/generateUserCourseProgress"

const BATCH_SIZE = 100

const prisma = new PrismaClient()

const sendEmail = async (emailDelivery: email_delivery) => {
  const {
    user_email_deliveryTouser: user,
    email_template_email_deliveryToemail_template: emailTemplate,
  } =
    (await prisma.email_delivery.findOne({
      where: { id: emailDelivery.id },
      select: {
        user_email_deliveryTouser: true,
        email_template_email_deliveryToemail_template: true,
      },
    })) ?? {}
  if (!emailTemplate || !user) {
    // TODO: should this update the delivery with error?
    console.error("No email template or user found while sending email")
    return
  }

  /*const user = await prisma.email_delivery.findOne({ where: { id: emailDelivery.id } }).user_email_deliveryTouser()
  const emailTemplate = await prisma
    .email_delivery.findOne({ where: { id: emailDelivery.id } })
    .email_template_email_deliveryToemail_template()*/
  console.log(`Delivering email ${emailTemplate.name} to ${user.email}`)
  try {
    await sendEmailTemplateToUser(user, emailTemplate)
    console.log("Marking email as delivered")
    await prisma.email_delivery.update({
      where: { id: emailDelivery.id },
      data: { sent: true, error: false },
    })
  } catch (e) {
    console.error("Sending failed", e.message)
    await prisma.email_delivery.update({
      where: { id: emailDelivery.id },
      data: { error: true, error_message: e.message },
    })
  }
}

const main = async () => {
  while (true) {
    const emailsToDeliver = await prisma.email_delivery.findMany({
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
