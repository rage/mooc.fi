import { StoredData } from "@prisma/client"

import { PruneOldStoredDataError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import Knex from "../services/knex"

const logger = sentryLogger({ service: "prune-old-stored-data" })

const pruneOldStoredData = async () => {
  logger.info("Pruning old stored data")
  try {
    const deletedStoredData = await Knex.raw<Array<StoredData>>(`
      DELETE
      FROM stored_data
      WHERE created_at < NOW() - INTERVAL '3 months'
      RETURNING *
    `)
    logger.info(`Pruned ${deletedStoredData.length} rows from stored_data`)
  } catch (e) {
    logger.error(
      new PruneOldStoredDataError(
        "Prune old stored data crashed",
        e instanceof Error ? e : new Error(e as string),
      ),
    )
    process.exit(-1)
  }
  logger.info("Done")
  process.exit(0)
}

pruneOldStoredData()
