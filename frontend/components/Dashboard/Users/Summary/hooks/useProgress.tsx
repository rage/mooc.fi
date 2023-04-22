import { useMemo } from "react"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

const useProgress = (
  data:
    | UserCourseSummaryCoreFieldsFragment
    | UserTierCourseSummaryCoreFieldsFragment,
) => {
  const totalProgress = useMemo(() => {
    const { course, user_course_progress } = data ?? {}
    const { exercise_progress, extra } = user_course_progress ?? {}

    if (extra) {
      return {
        percentage: (extra.pointsPercentage ?? 0) * 100,
        amount: extra.n_points ?? 0,
        total: extra.max_points ?? 0,
        ...(extra.pointsNeeded
          ? {
              required: extra.pointsNeeded,
              requiredPercentage:
                (extra.pointsNeeded / (extra.max_points || 1)) * 100,
              success: (extra.n_points ?? 0) >= extra.pointsNeeded,
            }
          : {}),
      }
    }
    return {
      percentage: (exercise_progress?.total ?? 0) * 100,
      amount: user_course_progress?.n_points ?? 0,
      total: user_course_progress?.max_points ?? 0,
      ...(course?.points_needed
        ? {
            required: course.points_needed,
            requiredPercentage:
              (course.points_needed / (user_course_progress?.max_points || 1)) *
              100,
            success:
              (user_course_progress?.n_points ?? 0) >= course.points_needed,
          }
        : {}),
    }
  }, [data])
  const exerciseProgress = useMemo(() => {
    const { course, user_course_progress } = data ?? {}
    const { exercise_progress, extra } = user_course_progress ?? {}

    if (extra) {
      return {
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
      }
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
  }, [data])

  return { totalProgress, exerciseProgress }
}

export default useProgress
