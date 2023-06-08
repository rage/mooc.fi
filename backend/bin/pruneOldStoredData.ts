import { PruneOldStoredDataError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import Knex from "../services/knex"

const logger = sentryLogger({ service: "prune-old-stored-data" })

const pruneOldStoredData = async () => {
  logger.info("Pruning old stored data")
  try {
    const deletedStoredDataCount = await Knex.raw(`
      WITH cte AS (
        DELETE
        FROM stored_data
        WHERE created_at < NOW() - INTERVAL '3 months'
        RETURNING *
      ) SELECT count(*) FROM cte;
    `)
    logger.info(
      `Pruned ${deletedStoredDataCount.rows[0].count} rows from stored_data`,
    )
  } catch (e) {
    logger.error(
      new PruneOldStoredDataError(
        "Prune old stored data crashed",
        e instanceof Error ? e : new Error(e as string),
      ),
    )
    throw e
  }
  logger.info("Done")
}

pruneOldStoredData()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((error) => {
    logger.error(error)
    return prisma.$disconnect().then(() => process.exit(1))
  })
