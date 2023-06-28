import { RemoveDuplicateCompletionsError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import Knex from "../services/knex"

const logger = sentryLogger({ service: "remove-duplicate-completions" })

const removeDuplicateCompletions = async () => {
  logger.info("Removing duplicate completions")
  try {
    const removedCount = await Knex.raw(`
      WITH cte AS (
        DELETE
        FROM completion
        WHERE id IN (
          SELECT id
          FROM (
            SELECT id,
              row_number() OVER (
                PARTITION BY "user_id", course_id
                ORDER BY created_at
              ) rn
            FROM completion
          ) s
          WHERE rn != 1
        )
        RETURNING completion.id
      ) SELECT COUNT(*) FROM cte;
    `)
    logger.info(`Removed ${removedCount.rows[0].count} duplicate completions`)
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateCompletionsError(
        "Remove duplicate completions crashed",
        e,
      ),
    )
    throw e
  }
  logger.info("Done")
}

removeDuplicateCompletions()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e)
    process.exit(1)
  })
