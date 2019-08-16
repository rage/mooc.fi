/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettingsesForUserPage
// ====================================================

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node_course {
  __typename: "Course"
  name: string
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node {
  __typename: "UserCourseSettings"
  id: any
  course: UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node_course | null
  language: string | null
  country: string | null
  research: boolean | null
  marketing: boolean | null
  course_variant: string | null
  other: any | null
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_edges {
  __typename: "UserCourseSettingsEdge"
  node: UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_pageInfo {
  __typename: "PageInfo"
  endCursor: string | null
  hasNextPage: boolean
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses {
  __typename: "UserCourseSettingsConnection"
  edges: UserCourseSettingsesForUserPage_UserCourseSettingses_edges[]
  pageInfo: UserCourseSettingsesForUserPage_UserCourseSettingses_pageInfo
}

export interface UserCourseSettingsesForUserPage {
  UserCourseSettingses: UserCourseSettingsesForUserPage_UserCourseSettingses
}

export interface UserCourseSettingsesForUserPageVariables {
  upstream_id?: number | null
}
