import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
  UserCourseSummaryCoreFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

export const userCourseSummarySortOptions = [
  "course_name",
  "activity_date",
  "completion_date",
] as const

export type UserCourseSummarySort =
  (typeof userCourseSummarySortOptions)[number]

export const sortOrderOptions = ["asc", "desc"] as const

export type SortOrder = (typeof sortOrderOptions)[number]

// eslint-disable-next-line @typescript-eslint/ban-types
type Simplify<T> = { [Key in keyof T]: T[Key] } & {}

type _UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment = Omit<
  UserCourseSummaryCoreFieldsFragment,
  "course"
> & {
  course: Omit<UserCourseSummaryCourseFieldsFragment, "exercises"> & {
    exercises: Array<
      ExerciseCoreFieldsFragment & {
        exercise_completions: Array<ExerciseCompletionCoreFieldsFragment> | null
      }
    >
  }
  tier_summaries: Array<UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment> | null
}

type _UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment = Omit<
  UserTierCourseSummaryCoreFieldsFragment,
  "course"
> & {
  course: Omit<UserCourseSummaryCourseFieldsFragment, "exercises"> & {
    exercises: Array<
      ExerciseCoreFieldsFragment & {
        exercise_completions: Array<ExerciseCompletionCoreFieldsFragment> | null
      }
    >
  }
}

export type UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment =
  Simplify<_UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment>
export type UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment =
  Simplify<_UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment>

export type CourseListEntry = Simplify<
  Pick<UserCourseSummaryCourseFieldsFragment, "id" | "slug" | "name"> & {
    tiers?: Array<
      Simplify<
        Pick<UserCourseSummaryCourseFieldsFragment, "id" | "slug" | "name">
      >
    >
  }
>
