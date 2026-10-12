import { Prisma } from "@prisma/client"

/**
 * Completions dated before a credit registration cutoff; falls back to `created_at` when there is
 * no `completion_date`. Keep both forms in sync. `created_at` is a UTC timestamp without time zone.
 */
export const completedBeforeCutoffWhere = (
  cutoff: Date,
): Prisma.CompletionWhereInput => ({
  OR: [
    { completion_date: { lt: cutoff } },
    { completion_date: null, created_at: { lt: cutoff } },
  ],
})

/** Knex raw form of {@link completedBeforeCutoffWhere}, comparing to the handler course's cutoff. */
export const COMPLETED_BEFORE_HANDLER_CUTOFF_SQL = `(
  completion.completion_date < handler_course.credit_registration_delegated_at
  OR (
    completion.completion_date IS NULL
    AND completion.created_at < handler_course.credit_registration_delegated_at AT TIME ZONE 'UTC'
  )
)`
