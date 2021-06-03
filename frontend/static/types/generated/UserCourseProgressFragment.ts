/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCourseProgressFragment
// ====================================================

export interface UserCourseProgressFragment_exercise_progress {
  __typename: "ExerciseProgress";
  total: number | null;
  exercises: number | null;
}

export interface UserCourseProgressFragment {
  __typename: "UserCourseProgress";
  id: string;
  course_id: string | null;
  max_points: number | null;
  n_points: number | null;
  progress: (any | null)[] | null;
  extra: any | null;
  exercise_progress: UserCourseProgressFragment_exercise_progress | null;
}
