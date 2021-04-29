/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCourseSummaryUserCourseProgressFragment
// ====================================================

export interface UserCourseSummaryUserCourseProgressFragment_user_course_progress_exercise_progress {
  __typename: "ExerciseProgress";
  total: number | null;
  exercises: number | null;
}

export interface UserCourseSummaryUserCourseProgressFragment_user_course_progress {
  __typename: "UserCourseProgress";
  id: string;
  course_id: string | null;
  max_points: number | null;
  n_points: number | null;
  progress: (any | null)[] | null;
  extra: any | null;
  exercise_progress: UserCourseSummaryUserCourseProgressFragment_user_course_progress_exercise_progress | null;
}

export interface UserCourseSummaryUserCourseProgressFragment {
  __typename: "UserCourseSummary";
  user_course_progress: UserCourseSummaryUserCourseProgressFragment_user_course_progress | null;
}
