/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserCourseStatsSubscribe
// ====================================================

export interface UserCourseStatsSubscribe_createCourseStatsSubscription {
  __typename: "CourseStatsSubscription";
  id: string;
}

export interface UserCourseStatsSubscribe {
  createCourseStatsSubscription: UserCourseStatsSubscribe_createCourseStatsSubscription | null;
}

export interface UserCourseStatsSubscribeVariables {
  id: string;
}
