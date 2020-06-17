/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettingsesForUserPage
// ====================================================

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node_course {
  __typename: "course"
  name: string
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node {
  __typename: "UserCourseSettings"
  id: string
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
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: UserCourseSettingsesForUserPage_UserCourseSettingses_edges_node | null
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses_pageInfo {
  __typename: "PageInfo"
  /**
   * The cursor corresponding to the last nodes in edges. Null if the connection is empty.
   */
  endCursor: string | null
  /**
   * Used to indicate whether more edges exist following the set defined by the clients arguments.
   */
  hasNextPage: boolean
}

export interface UserCourseSettingsesForUserPage_UserCourseSettingses {
  __typename: "QueryUserCourseSettingses_Connection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges:
    | (UserCourseSettingsesForUserPage_UserCourseSettingses_edges | null)[]
    | null
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: UserCourseSettingsesForUserPage_UserCourseSettingses_pageInfo
}

export interface UserCourseSettingsesForUserPage {
  UserCourseSettingses: UserCourseSettingsesForUserPage_UserCourseSettingses | null
}

export interface UserCourseSettingsesForUserPageVariables {
  upstream_id?: number | null
}
