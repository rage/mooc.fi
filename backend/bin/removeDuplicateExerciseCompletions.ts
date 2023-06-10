import { Knex } from "knex"
import * as winston from "winston"

import { CIRCLECI, isProduction } from "../config"
import { RemoveDuplicateExerciseCompletionsError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import serviceKnex from "../services/knex"

const _logger = sentryLogger({
  service: "remove-duplicate-exercise-completions",
})

export const removeDuplicateExerciseCompletions = async (
  knex: Knex = serviceKnex,
  logger: winston.Logger = _logger,
) => {
  logger.info("Removing duplicate exercise completions")
  try {
    const removedCount = await knex.raw(`
      WITH cte AS (
        DELETE FROM exercise_completion
        WHERE id IN (
          SELECT id FROM (
            SELECT
              ec.id,
              row_number() OVER (PARTITION BY user_id, exercise_id, timestamp ORDER BY timestamp DESC, updated_at DESC) rn
            FROM exercise_completion ec
            GROUP BY ec.id
          ) s
          WHERE rn > 1
        )
        RETURNING exercise_completion.id
      ) SELECT COUNT(*) FROM cte;
    `)
    logger.info(
      `Removed ${removedCount.rows[0].count} duplicate exercise completions`,
    )
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateExerciseCompletionsError(
        "Remove duplicate exercise completions crashed",
        e,
      ),
    )
    throw e
  }

  logger.info("Removing orphaned exercise completion required actions")
  try {
    const removedCount = await knex.raw(`
      WITH cte AS (
        DELETE FROM exercise_completion_required_actions
        WHERE exercise_completion_id IS null
        RETURNING exercise_completion_required_actions.id
      ) SELECT COUNT(*) FROM cte;
    `)
    logger.info(
      `Removed ${removedCount.rows[0].count} orphaned exercise completion required actions`,
    )
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateExerciseCompletionsError(
        "Remove orphaned exercise completion required actions crashed",
        e,
      ),
    )
    throw e
  }

  logger.info("Done")
}

if (isProduction && !CIRCLECI) {
  removeDuplicateExerciseCompletions()
    .then(() => {
      process.exit(0)
    })
    .catch((e) => {
      _logger.error(e)
      process.exit(1)
    })
}
