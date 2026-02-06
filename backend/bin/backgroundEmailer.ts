import { EmailDelivery } from "@prisma/client"

import { isProduction } from "../config"
import { EmailTemplaterError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import { emptyOrNullToUndefined } from "../util"
import { sendEmailTemplateToUser } from "./kafkaConsumer/common/EmailTemplater/sendEmailTemplate"

const BATCH_SIZE = 100
const RETRY_CHECK_INTERVAL_MS = 10 * 60 * 1000
const RETRY_WINDOW_MS = 3 * 24 * 60 * 60 * 1000
const RETRY_BACKOFF_BASE_MS = 10 * 60 * 1000
const RETRY_BACKOFF_MAX_MS = 6 * 60 * 60 * 1000
const RETRY_CANDIDATE_BATCH_SIZE = 500
const RETRY_REQUEUE_LIMIT = 500
const TEMPLATE_ID_CACHE_TTL_MS = 60 * 60 * 1000

const logger = sentryLogger({ service: "background-emailer" })

// Backoff is age-based (created_at), since we don't track attempt count.
const getRetryBackoffMs = (createdAt: Date, now: Date) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const exponent = Math.max(
    0,
    Math.floor(Math.log2(ageMs / RETRY_BACKOFF_BASE_MS + 1)) - 1,
  )
  return Math.min(RETRY_BACKOFF_MAX_MS, RETRY_BACKOFF_BASE_MS * 2 ** exponent)
}

let cachedTemplateIds: string[] = []
let lastTemplateIdFetchAt = 0

const getCourseStatsTemplateIds = async (now: number) => {
  if (
    cachedTemplateIds.length > 0 &&
    now - lastTemplateIdFetchAt < TEMPLATE_ID_CACHE_TTL_MS
  ) {
    return cachedTemplateIds
  }

  const courseStatsTemplateIds = await prisma.courseStatsSubscription.findMany({
    select: { email_template_id: true },
    distinct: ["email_template_id"],
  })
  cachedTemplateIds = courseStatsTemplateIds
    .map((entry) => entry.email_template_id)
    .filter((id): id is string => Boolean(id))
  lastTemplateIdFetchAt = now

  return cachedTemplateIds
}

const retryErroredCourseStatsEmails = async () => {
  const now = new Date()
  const retryWindowStart = new Date(now.getTime() - RETRY_WINDOW_MS)

  logger.info(
    `Retry check: course stats errors created after ${retryWindowStart.toISOString()} with exponential backoff`,
  )

  const templateIds = await getCourseStatsTemplateIds(now.getTime())

  if (templateIds.length === 0) {
    logger.info("Retry check: no course stats email templates found, skipping")
    return
  }

  logger.info(
    `Retry check: found ${templateIds.length} course stats email templates`,
  )

  let cursorId: string | undefined
  let totalCandidates = 0
  const eligibleIds: string[] = []

  while (eligibleIds.length < RETRY_REQUEUE_LIMIT) {
    const batch = await prisma.emailDelivery.findMany({
      where: {
        error: true,
        sent: false,
        created_at: { gte: retryWindowStart },
        email_template_id: { in: templateIds },
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        error_message: true,
      },
      orderBy: { updated_at: "asc" },
      take: RETRY_CANDIDATE_BATCH_SIZE,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
    })

    if (batch.length === 0) {
      break
    }

    totalCandidates += batch.length
    cursorId = batch[batch.length - 1]?.id

    for (const candidate of batch) {
      const backoffMs = getRetryBackoffMs(candidate.created_at, now)
      const elapsedSinceUpdateMs =
        now.getTime() - candidate.updated_at.getTime()
      if (elapsedSinceUpdateMs >= backoffMs) {
        eligibleIds.push(candidate.id)
        if (eligibleIds.length >= RETRY_REQUEUE_LIMIT) {
          break
        }
      }
    }
  }

  if (eligibleIds.length === 0) {
    logger.info(
      `Retry check: no course stats emails eligible for retry (candidates scanned: ${totalCandidates})`,
    )
    return
  }

  const { count } = await prisma.emailDelivery.updateMany({
    where: { id: { in: eligibleIds } },
    data: {
      error: { set: false },
    },
  })

  logger.info(
    `Re-queued ${count} errored course stats emails for retry (candidates scanned: ${totalCandidates}, capped at ${RETRY_REQUEUE_LIMIT})`,
  )
}

const sendEmail = async (emailDelivery: EmailDelivery) => {
  const { user, email_template, organization } =
    (await prisma.emailDelivery.findUnique({
      where: { id: emailDelivery.id },
      select: {
        user: true,
        organization: true,
        email_template: true,
      },
    })) ?? {}

  if (!email_template || !user) {
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: {
        error: { set: true },
        error_message: "No email template or user found while sending email",
      },
    })

    logger.error(
      new EmailTemplaterError(
        "No email template or user found while sending email",
        { email_template, user_id: user?.id },
      ),
    )

    return
  }

  const email = emailDelivery.email ?? user.email

  logger.info(
    `Delivering email "${email_template.name}" to ${email} (user upstream_id ${user.upstream_id})`,
  )

  try {
    await sendEmailTemplateToUser({
      user,
      template: email_template,
      email,
      organization: emptyOrNullToUndefined(organization),
      context: { prisma, logger, test: !isProduction },
    })
    logger.info("Marking email as delivered")

    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: {
        sent: { set: true },
        error: { set: false },
      },
    })
  } catch (e: any) {
    await prisma.emailDelivery.update({
      where: { id: emailDelivery.id },
      data: {
        error: { set: true },
        error_message: e.message,
      },
    })
    logger.error(
      new EmailTemplaterError(
        "Sending failed",
        { user_id: user.id, email_template },
        e,
      ),
    )
  }
}

const main = async () => {
  let lastRetryCheckAt = 0
  while (true) {
    const now = Date.now()
    if (now - lastRetryCheckAt >= RETRY_CHECK_INTERVAL_MS) {
      try {
        await retryErroredCourseStatsEmails()
      } catch (error: any) {
        logger.error(
          new EmailTemplaterError("Retry check failed", undefined, error),
        )
      } finally {
        lastRetryCheckAt = Date.now()
      }
    }

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

main().catch((e) => {
  logger.error(e)
  process.exit(1)
})
