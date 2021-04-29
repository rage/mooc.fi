/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCourseSummaryUserCourseServiceProgressFragment
// ====================================================

export interface UserCourseSummaryUserCourseServiceProgressFragment_user_course_service_progresses_service {
  __typename: "Service";
  name: string;
  id: string;
}

export interface UserCourseSummaryUserCourseServiceProgressFragment_user_course_service_progresses {
  __typename: "UserCourseServiceProgress";
  progress: (any | null)[] | null;
  service: UserCourseSummaryUserCourseServiceProgressFragment_user_course_service_progresses_service | null;
}

export interface UserCourseSummaryUserCourseServiceProgressFragment {
  __typename: "UserCourseSummary";
  user_course_service_progresses: (UserCourseSummaryUserCourseServiceProgressFragment_user_course_service_progresses | null)[] | null;
}
