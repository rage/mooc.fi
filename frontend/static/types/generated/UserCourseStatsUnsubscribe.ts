/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserCourseStatsUnsubscribe
// ====================================================

export interface UserCourseStatsUnsubscribe_deleteCourseStatsSubscription {
  __typename: "CourseStatsSubscription"
  id: string
}

export interface UserCourseStatsUnsubscribe {
  deleteCourseStatsSubscription: UserCourseStatsUnsubscribe_deleteCourseStatsSubscription | null
}

export interface UserCourseStatsUnsubscribeVariables {
  id: string
}
