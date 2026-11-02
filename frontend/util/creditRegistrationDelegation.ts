interface DelegatableCompletion {
  completion_date?: string | null
  created_at?: string | null
  course?: { credit_registration_delegated_at?: string | null } | null
}

/**
 * Whether courses.mooc.fi registers this completion's credits: it is dated on or after its
 * course's cutoff. Must match the backend's completedBeforeCutoff.
 */
export const isCompletedAfterCutoff = ({
  completion_date,
  created_at,
  course,
}: DelegatableCompletion) => {
  const delegatedAt = course?.credit_registration_delegated_at
  const effectiveDate = completion_date ?? created_at
  return Boolean(
    delegatedAt &&
      effectiveDate &&
      new Date(effectiveDate) >= new Date(delegatedAt),
  )
}
