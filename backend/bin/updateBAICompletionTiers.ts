import { Completion, User } from "@prisma/client"

import prisma from "../prisma"
import knex from "../services/knex"
import { checkBAICompletion } from "./kafkaConsumer/common/userCourseProgress/BAI/completion"
import sentryLogger from "./lib/logger"

const logger = sentryLogger({ service: "update-bai-completion-tiers" })

const PARENT_COURSE_ID = "49cbadd8-be32-454f-9b7d-e84d52100b74"

const updateBAICompletionTiers = async () => {
  const course = await prisma.course.findUnique({
    where: { id: PARENT_COURSE_ID },
  })

  if (!course) {
    logger.error(new Error("couldn't find parent course!"))
    process.exit(1)
  }

  logger.info("Getting completions")

  const userIdsWithoutTiers = await knex<any, Pick<Completion, "user_id">[]>(
    "completion",
  )
    .select("user_id")
    .where("course_id", PARENT_COURSE_ID)
    .andWhere("tier", "is", null)

  logger.info("Getting users")
  const usersWithoutTiers = await knex<any, User[]>("user")
    .select("*")
    .whereIn(
      "id",
      userIdsWithoutTiers.map((u) => u.user_id),
    )

  logger.info(`Updating ${usersWithoutTiers.length} users...`)

  for (const user of usersWithoutTiers) {
    // assuming no handler as we're querying the handler course specifically
    await checkBAICompletion({
      user,
      course,
      context: {
        logger,
        prisma,
        knex,
        consumer: null as any,
        mutex: null as any,
        topic_name: "",
      },
    })
  }

  logger.info("Done")
  process.exit(0)
}

updateBAICompletionTiers()
