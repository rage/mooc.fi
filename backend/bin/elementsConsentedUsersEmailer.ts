import { ELEMENTS_CONSENTED_USERS_RECIPIENTS } from "../config"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import { sendMail } from "../util/sendMail"

const logger = sentryLogger({ service: "elements-consented-users-emailer" })

const elementsConsentedUsersEmailer = async () => {
  const recipients = ELEMENTS_CONSENTED_USERS_RECIPIENTS?.split(";")

  if (!recipients) {
    throw new Error("No recipients set for elements consented users emails")
  }

  const result = await prisma.$queryRaw<
    Array<{ email: string; first_login_date: string }>
  >`
    SELECT u.email, ucs.created_at as first_login_date
      FROM "user" u
      JOIN user_course_setting ucs on ucs.user_id = u.id
    WHERE ucs.created_at >= current_date - 7
      AND ucs.research = true
      AND course_id = '55dff8af-c06c-4a97-88e6-af7c04d252ca'::uuid;
  `

  const text = result
    .map(({ email, first_login_date }) => `${email},${first_login_date}`)
    .join("\n")

  await sendMail({
    to: recipients,
    text,
    subject: "Elements of AI consented users",
  })
}

elementsConsentedUsersEmailer()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((error) => {
    logger.error(error)
    return prisma.$disconnect().then(() => process.exit(1))
  })
