export const userCourseSummarySortOptions = [
  "course_name",
  "activity_date",
  "completion_date",
] as const

export type UserCourseSummarySort =
  (typeof userCourseSummarySortOptions)[number]

export const sortOrderOptions = ["asc", "desc"] as const

export type SortOrder = (typeof sortOrderOptions)[number]
