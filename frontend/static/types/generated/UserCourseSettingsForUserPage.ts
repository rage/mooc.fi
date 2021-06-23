/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettingsForUserPage
// ====================================================

export interface UserCourseSettingsForUserPage_userCourseSettings_edges_node_course {
  __typename: "Course"
  name: string
}

export interface UserCourseSettingsForUserPage_userCourseSettings_edges_node {
  __typename: "UserCourseSetting"
  id: string
  course: UserCourseSettingsForUserPage_userCourseSettings_edges_node_course | null
  language: string | null
  country: string | null
  research: boolean | null
  marketing: boolean | null
  course_variant: string | null
  other: any | null
}

export interface UserCourseSettingsForUserPage_userCourseSettings_edges {
  __typename: "UserCourseSettingEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: UserCourseSettingsForUserPage_userCourseSettings_edges_node | null
}

export interface UserCourseSettingsForUserPage_userCourseSettings_pageInfo {
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

export interface UserCourseSettingsForUserPage_userCourseSettings {
  __typename: "QueryUserCourseSettings_type_Connection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges:
    | (UserCourseSettingsForUserPage_userCourseSettings_edges | null)[]
    | null
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: UserCourseSettingsForUserPage_userCourseSettings_pageInfo
}

export interface UserCourseSettingsForUserPage {
  userCourseSettings: UserCourseSettingsForUserPage_userCourseSettings | null
}

export interface UserCourseSettingsForUserPageVariables {
  upstream_id?: number | null
}
