import { RemoveDuplicateCompletionsError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import Knex from "../services/knex"

const logger = sentryLogger({ service: "remove-duplicate-completions" })

const removeDuplicateCompletions = async () => {
  logger.info("Removing duplicate completions")
  try {
    await Knex.raw(`
    DELETE
    FROM completion
    WHERE id IN (SELECT id
                  FROM completion
                  WHERE course_id = '55dff8af-c06c-4a97-88e6-af7c04d252ca'
                    AND id IN (
                    SELECT id
                    FROM (
                          SELECT id,
                                  row_number() OVER (
                                    PARTITION BY "user_id",
                                      course_id
                                    ORDER BY
                                      created_at
                                    ) rn
                          FROM completion
                        ) s
                    WHERE rn != 1
                  ))
        `)
  } catch (e: any) {
    logger.error(
      new RemoveDuplicateCompletionsError(
        "Remove duplicate completions crashed",
        e,
      ),
    )
    process.exit(-1)
  }
  logger.info("Done")
  process.exit(0)
}

removeDuplicateCompletions()
