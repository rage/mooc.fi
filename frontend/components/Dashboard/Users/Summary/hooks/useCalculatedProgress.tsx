import { useMemo } from "react"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

type CourseSummary =
  | UserCourseSummaryCoreFieldsFragment
  | UserTierCourseSummaryCoreFieldsFragment

type UserCourseProgress = NonNullable<CourseSummary["user_course_progress"]>
type ProgressExtra = NonNullable<UserCourseProgress["extra"]>

const extraTotalProgress = (extra: ProgressExtra) => ({
  percentage: (extra.pointsPercentage ?? 0) * 100,
  amount: extra.n_points ?? 0,
  total: extra.max_points ?? 0,
  ...(extra.pointsNeeded
    ? {
        required: extra.pointsNeeded,
        requiredPercentage:
          extra.max_points > 0
            ? (extra.pointsNeeded / extra.max_points) * 100
            : 0,
        success: (extra.n_points ?? 0) >= extra.pointsNeeded,
      }
    : {}),
})

const calculateTotalProgress = (data: CourseSummary) => {
  const { course, user_course_progress } = data ?? {}
  const { exercise_progress, extra } = user_course_progress ?? {}

  if (extra) {
    return extraTotalProgress(extra)
  }
  return {
    percentage: (exercise_progress?.total ?? 0) * 100,
    amount: user_course_progress?.n_points ?? 0,
    total: user_course_progress?.max_points ?? 0,
    ...(course?.points_needed
      ? {
          required: course.points_needed,
          requiredPercentage:
            user_course_progress?.max_points &&
            user_course_progress?.max_points > 0
              ? (course.points_needed / user_course_progress.max_points) * 100
              : 0,
          success:
            (user_course_progress?.n_points ?? 0) >= course.points_needed,
        }
      : {}),
  }
}

const extraExerciseProgress = (extra: ProgressExtra) => ({
  percentage: (extra.exercisePercentage ?? 0) * 100,
  amount: extra.totalExerciseCompletions ?? 0,
  total: extra.totalExerciseCount ?? 0,
  ...(extra.totalExerciseCompletionsNeeded
    ? {
        required: extra.totalExerciseCompletionsNeeded,
        requiredPercentage:
          (extra.totalExerciseCompletionsNeeded /
            (extra.totalExerciseCount || 1)) *
          100,
        success:
          (extra.totalExerciseCompletions ?? 0) >=
          extra.totalExerciseCompletionsNeeded,
      }
    : {}),
})

const calculateExerciseProgress = (data: CourseSummary) => {
  const { course, user_course_progress } = data ?? {}
  const { exercise_progress, extra } = user_course_progress ?? {}

  if (extra) {
    return extraExerciseProgress(extra)
  }
  return {
    percentage: (exercise_progress?.exercises ?? 0) * 100,
    amount: exercise_progress?.exercises_completed_count ?? 0,
    total: exercise_progress?.exercise_count ?? 0,
    ...(course?.exercise_completions_needed
      ? {
          required: course.exercise_completions_needed,
          requiredPercentage:
            (course.exercise_completions_needed /
              (exercise_progress?.exercise_count || 1)) *
            100,
          success:
            (exercise_progress?.exercises_completed_count ?? 0) >=
            course.exercise_completions_needed,
        }
      : {}),
  }
}

const useCalculatedProgress = (data: CourseSummary) => {
  const totalProgress = useMemo(() => calculateTotalProgress(data), [data])
  const exerciseProgress = useMemo(
    () => calculateExerciseProgress(data),
    [data],
  )

  return { totalProgress, exerciseProgress }
}

export default useCalculatedProgress
