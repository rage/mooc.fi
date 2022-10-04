import { Knex } from "knex"
import * as winston from "winston"

import { CIRCLECI, isProduction } from "../config"
import serviceKnex from "../services/knex"
import { RemoveDuplicateExerciseCompletionsError } from "./lib/errors"
import sentryLogger from "./lib/logger"

const _logger = sentryLogger({
  service: "remove-duplicate-exercise-completions",
})

export const removeDuplicateExerciseCompletions = async (
  knex: Knex = serviceKnex,
  logger: winston.Logger = _logger,
) => {
  logger.info("Removing duplicate exercise completions")
  try {
    await knex.raw(`
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
      );
    `)
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateExerciseCompletionsError(
        "Remove duplicate exercise completions crashed",
        e,
      ),
    )
    process.exit(-1)
  }

  logger.info("Removing orphaned exercise completion required actions")
  try {
    await knex.raw(`
      DELETE FROM exercise_completion_required_actions
      WHERE exercise_completion_id IS null
    `)
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateExerciseCompletionsError(
        "Remove orphaned exercise completion required actions crashed",
        e,
      ),
    )
    process.exit(-1)
  }

  logger.info("Done")
  process.exit(0)
}

if (isProduction && !CIRCLECI) {
  removeDuplicateExerciseCompletions()
}
