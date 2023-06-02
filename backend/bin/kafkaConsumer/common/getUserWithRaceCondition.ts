import { User } from "@prisma/client"

import { BaseContext } from "../../../context"
import { TMCError } from "../../../lib/errors"

export async function getUserWithRaceCondition(
  context: BaseContext,
  user_id: number,
): Promise<User | null> {
  let user: User | null

  const { knex, logger, prisma } = context
  user = (await knex("user").where("upstream_id", user_id).limit(1))[0]

  if (!user) {
    try {
      user = await prisma.user.createFromTMC(user_id)
    } catch (e) {
      try {
        user = (await knex("user").where("upstream_id", user_id).limit(1))[0]
      } catch {}

      if (!user) {
        logger.error(new TMCError(`couldn't find user`, { user_id }, e))
        throw e
      }
      logger.info("Mitigated race condition with user imports")
    }
  }

  return user
}
