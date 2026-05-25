import { LINKOPING_COMPLETION_RECIPIENTS } from "../config"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import { sendMail } from "../util/sendMail"

const logger = sentryLogger({ service: "linkoping-stats-emailer" })

const linkopingStatsEmailer = async () => {
  const recipients = LINKOPING_COMPLETION_RECIPIENTS?.split(";")

  if (!recipients) {
    throw new Error("No recipients set for completion emails")
  }

  const result = await prisma.$queryRaw<
    Array<{ email: string; completion_date: string; tier: number }>
  >`
    WITH unique_completions AS (
      SELECT DISTINCT ON (u.email, c.tier) u.email, c.completion_date, c.tier
        FROM "user" u
        JOIN user_course_setting ucs on ucs.user_id = u.id
        JOIN completion c on c.user_id = u.id
      WHERE u.email ILIKE '%liu.se'
        AND ucs.other ->> 'ects_consent_sweden' = 'true'
        AND ucs.other ->> 'bai_completion' = 'true'
        AND c.course_id = '49cbadd8-be32-454f-9b7d-e84d52100b74'::uuid
        AND ucs.country = 'Sweden'
      ORDER BY u.email, c.tier, c.completion_date
    )
    SELECT email, completion_date, tier
      FROM unique_completions
    ORDER BY completion_date, email, tier;
  `

  const text = result
    .map(
      ({ email, completion_date, tier }) =>
        `${email},${completion_date},${tier}`,
    )
    .join("\n")

  await sendMail({
    to: recipients,
    text,
    subject: "Building AI completions",
  })
}

linkopingStatsEmailer()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((error) => {
    logger.error(error)
    return prisma.$disconnect().then(() => process.exit(1))
  })
