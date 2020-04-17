import { Prisma, EmailDelivery } from "../generated/prisma-client"
import { sendEmailTemplateToUser } from "./kafkaConsumer/userCourseProgressConsumer/generateUserCourseProgress"

const BATCH_SIZE = 100

const prisma = new Prisma()

const sendEmail = async (emailDelivery: EmailDelivery) => {
  const user = await prisma.emailDelivery({ id: emailDelivery.id }).user()
  const emailTemplate = await prisma
    .emailDelivery({ id: emailDelivery.id })
    .email_template()
  console.log(`Delivering email ${emailTemplate.name} to ${user.email}`)
  try {
    await sendEmailTemplateToUser(user, emailTemplate)
    console.log("Marking email as delivered")
    await prisma.updateEmailDelivery({
      where: { id: emailDelivery.id },
      data: { sent: true, error: false },
    })
  } catch (e) {
    console.error("Sending failed", e.message)
    await prisma.updateEmailDelivery({
      where: { id: emailDelivery.id },
      data: { error: true, error_message: e.message },
    })
  }
}

const main = async () => {
  while (true) {
    console.log("Fetching a batch of emails to send.")
    const emailsToDeliver = await prisma.emailDeliveries({
      where: { sent: false, error: false },
      first: BATCH_SIZE,
    })
    // No parallelism for now so that we don't accidentally bump into sending limits
    for (const emailDelivery of emailsToDeliver) {
      await sendEmail(emailDelivery)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

main()
