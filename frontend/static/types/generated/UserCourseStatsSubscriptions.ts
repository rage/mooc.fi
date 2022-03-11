/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseStatsSubscriptions
// ====================================================

export interface UserCourseStatsSubscriptions_currentUser_course_stats_subscriptions_email_template {
  __typename: "EmailTemplate"
  id: string
}

export interface UserCourseStatsSubscriptions_currentUser_course_stats_subscriptions {
  __typename: "CourseStatsSubscription"
  id: string
  email_template: UserCourseStatsSubscriptions_currentUser_course_stats_subscriptions_email_template | null
}

export interface UserCourseStatsSubscriptions_currentUser {
  __typename: "User"
  id: string
  course_stats_subscriptions: UserCourseStatsSubscriptions_currentUser_course_stats_subscriptions[]
}

export interface UserCourseStatsSubscriptions {
  currentUser: UserCourseStatsSubscriptions_currentUser | null
}
