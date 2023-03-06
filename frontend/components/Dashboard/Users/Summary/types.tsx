export const userCourseSummaryEntryOrderOptions = [
  "course_name",
  "activity_date",
  "completion_date",
] as const

export type UserCourseSummaryEntryOrder =
  (typeof userCourseSummaryEntryOrderOptions)[number]
