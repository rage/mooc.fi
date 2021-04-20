import { User } from "@prisma/client"
import { KafkaContext } from "./kafkaContext"
import { TMCError } from "../../lib/errors"
import getUserFromTMCAndCreate from "./getUserFromTMC"

export async function getUserWithRaceCondition(
  context: KafkaContext,
  user_id: number,
): Promise<User | null> {
  let user: User | null

  const { knex, logger, prisma } = context
  user = (await knex("user").where("upstream_id", user_id).limit(1))[0]

  if (!user) {
    try {
      user = await getUserFromTMCAndCreate(prisma, user_id)
    } catch (e) {
      try {
        user = (await knex("user").where("upstream_id", user_id).limit(1))[0]
      } catch {}
      if (!user) {
        logger.error(new TMCError(`couldn't find user ${user_id}`, e))
        throw e
      }
      logger.info("Mitigated race condition with user imports")
    }
  }

  return user
}
