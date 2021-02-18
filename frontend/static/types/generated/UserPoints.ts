/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPoints
// ====================================================

export interface UserPoints_currentUser_progresses_course {
  __typename: "Course";
  name: string;
  id: string;
}

export interface UserPoints_currentUser_progresses_user_course_progress_exercise_progress {
  __typename: "ExerciseProgress";
  total: number | null;
  exercises: number | null;
}

export interface UserPoints_currentUser_progresses_user_course_progress_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  real_student_number: string | null;
}

export interface UserPoints_currentUser_progresses_user_course_progress {
  __typename: "UserCourseProgress";
  progress: (any | null)[] | null;
  exercise_progress: UserPoints_currentUser_progresses_user_course_progress_exercise_progress | null;
  user: UserPoints_currentUser_progresses_user_course_progress_user | null;
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses_service {
  __typename: "Service";
  name: string;
  id: string;
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress";
  progress: (any | null)[] | null;
  service: UserPoints_currentUser_progresses_user_course_service_progresses_service | null;
}

export interface UserPoints_currentUser_progresses {
  __typename: "Progress";
  course: UserPoints_currentUser_progresses_course | null;
  user_course_progress: UserPoints_currentUser_progresses_user_course_progress | null;
  user_course_service_progresses: (UserPoints_currentUser_progresses_user_course_service_progresses | null)[] | null;
}

export interface UserPoints_currentUser {
  __typename: "User";
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  student_number: string | null;
  progresses: UserPoints_currentUser_progresses[] | null;
}

export interface UserPoints {
  currentUser: UserPoints_currentUser | null;
}
