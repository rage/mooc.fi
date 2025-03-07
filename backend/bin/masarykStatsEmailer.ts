import { PRAGUE_COMPLETION_RECIPIENTS } from "../config"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import { sendMail } from "../util/sendMail"

const logger = sentryLogger({ service: "masaryk-stats-emailer" })

const masarykStatsEmailer = async () => {
  // Same recipients as for prague stats as masaryk stats are sent to the same partner in CZ, who re-distributes the stats to the universities
  const recipients = PRAGUE_COMPLETION_RECIPIENTS?.split(";")

  if (!recipients) {
    throw new Error("No recipients set for completion emails")
  }

  // TODO: one completion per user?
  const result = await prisma.$queryRaw<
    Array<{ email: string; completion_date: string; tier: number }>
  >`
    SELECT co.tier, u.email, co.completion_date
      FROM "user" u
      JOIN completion co on u.id = co.user_id
    WHERE co.course_id = '49cbadd8-be32-454f-9b7d-e84d52100b74'::uuid
      AND u.email ILIKE '%@muni.cz' OR u.email ILIKE '%@mail.muni.cz'
    GROUP BY co.tier, u.email, co.completion_date
    ORDER BY co.completion_date DESC, u.email, co.tier;
  `

  const tiers: Record<number, Array<string>> = {}

  for (const { email, completion_date, tier } of result) {
    if (!tiers[tier]) {
      tiers[tier] = []
    }

    tiers[tier].push(`${email},${completion_date},${tier}`)
  }

  const tierNames: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  }

  let text = ""

  for (let tier = 1; tier <= 3; tier++) {
    text += `${tierNames[tier]}:\n\n`
    if (!tiers[tier]?.length) {
      text += "No completions for this tier\n"
    } else {
      text += tiers[tier].join("\n")
    }
    text += "\n"
  }

  await sendMail({
    to: recipients,
    text,
    subject: "Building AI completions",
  })
}

masarykStatsEmailer()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((error) => {
    logger.error(error)
    return prisma.$disconnect().then(() => process.exit(1))
  })
