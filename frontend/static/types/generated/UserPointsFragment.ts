/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserPointsFragment
// ====================================================

export interface UserPointsFragment_progresses_course {
  __typename: "Course";
  name: string;
  id: any;
}

export interface UserPointsFragment_progresses_user_course_progress_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  real_student_number: string | null;
}

export interface UserPointsFragment_progresses_user_course_progress {
  __typename: "UserCourseProgress";
  progress: any;
  user: UserPointsFragment_progresses_user_course_progress_user;
}

export interface UserPointsFragment_progresses_user_course_service_progresses_service {
  __typename: "Service";
  name: string;
  id: any;
}

export interface UserPointsFragment_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress";
  progress: any;
  service: UserPointsFragment_progresses_user_course_service_progresses_service;
}

export interface UserPointsFragment_progresses {
  __typename: "Progress";
  course: UserPointsFragment_progresses_course;
  user_course_progress: UserPointsFragment_progresses_user_course_progress | null;
  user_course_service_progresses: UserPointsFragment_progresses_user_course_service_progresses[];
}

export interface UserPointsFragment {
  __typename: "User";
  id: any;
  first_name: string | null;
  last_name: string | null;
  email: string;
  student_number: string | null;
  progresses: UserPointsFragment_progresses[];
}
