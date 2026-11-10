interface DelegatableCompletion {
  completion_date?: string | null
  created_at?: string | null
  course?: { credit_registration_delegated_at?: string | null } | null
}

interface ComparableCompletion {
  id: string
  completion_date?: string | null
  created_at?: string | null
  grade?: string | null
  tier?: number | null
  registered?: boolean | null
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

const PASS_WORDS = [
  "pass",
  "passed",
  "hyväksytty",
  "hyv",
  "godkänd",
  "accepted",
]
const FAIL_WORDS = ["fail", "failed", "hylätty", "hyl", "underkänd"]

/**
 * A free-text grade read as courses.mooc.fi reads it: "pass", "fail", "1"–"5", or null when not
 * recognised. No grade is a pass, as on a pass/fail course; on a numeric one courses.mooc.fi
 * cannot register it anyway.
 */
export const normalizeGrade = (grade?: string | null): string | null => {
  const normalized = (grade ?? "").trim().toLowerCase()
  if (normalized === "" || PASS_WORDS.includes(normalized)) {
    return "pass"
  }
  if (FAIL_WORDS.includes(normalized)) {
    return "fail"
  }
  const number = Number(normalized.replace(",", "."))
  if (number === 0) {
    return "fail"
  }
  return Number.isInteger(number) && number >= 1 && number <= 5
    ? String(number)
    : null
}

const effectiveTime = ({ completion_date, created_at }: ComparableCompletion) =>
  new Date(completion_date ?? created_at ?? 0).getTime()

/**
 * Whether courses.mooc.fi refuses to register `completion` because an earlier completion of the
 * same course, among `courseCompletions`, is registered with the same grade and tier. One dated
 * the same moment counts as earlier. Must match courses.mooc.fi's moocfi_registered_equivalent.
 */
export const hasRegisteredEquivalent = (
  completion: ComparableCompletion,
  courseCompletions: ComparableCompletion[],
) =>
  !completion.registered &&
  courseCompletions.some(
    (earlier) =>
      earlier.id !== completion.id &&
      Boolean(earlier.registered) &&
      effectiveTime(earlier) <= effectiveTime(completion) &&
      (earlier.tier ?? null) === (completion.tier ?? null) &&
      normalizeGrade(earlier.grade) === normalizeGrade(completion.grade),
  )
