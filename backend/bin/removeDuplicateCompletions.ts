import Knex from "../services/knex"

const removeDuplicateCompletions = async () => {
  await Knex.raw(`
        DELETE
        FROM completion
        WHERE id IN (SELECT id
                    FROM completion
                    WHERE course = '55dff8af-c06c-4a97-88e6-af7c04d252ca'
                    AND id IN (
                        SELECT id
                        FROM (
                                SELECT id,
                                        row_number() OVER (
                                            PARTITION BY "user",
                                                course
                                            ORDER BY
                                                created_at
                                            ) rn
                                FROM completion
                            ) s
                        WHERE rn != 1
                    ))
    `)
}

removeDuplicateCompletions()
