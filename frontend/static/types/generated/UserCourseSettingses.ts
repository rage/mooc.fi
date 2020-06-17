/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettingses
// ====================================================

export interface UserCourseSettingses_UserCourseSettingses_pageInfo {
  __typename: "PageInfo"
  /**
   * Used to indicate whether more edges exist following the set defined by the clients arguments.
   */
  hasNextPage: boolean
  /**
   * The cursor corresponding to the last nodes in edges. Null if the connection is empty.
   */
  endCursor: string | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_course {
  __typename: "course"
  name: string
  id: string
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress_exercise_progress {
  __typename: "exercise_progress"
  total: number | null
  exercises: number | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress_user {
  __typename: "user"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress {
  __typename: "user_course_progress"
  progress: any
  exercise_progress: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress_exercise_progress | null
  user: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress_user | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_service_progresses_service {
  __typename: "service"
  name: string
  id: string
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_service_progresses {
  __typename: "user_course_service_progress"
  progress: any
  service: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_service_progresses_service | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progress {
  __typename: "progress"
  course: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_course | null
  user_course_progress: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_progress | null
  user_course_service_progresses:
    | UserCourseSettingses_UserCourseSettingses_edges_node_user_progress_user_course_service_progresses[]
    | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user {
  __typename: "user"
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  real_student_number: string | null
  progress: UserCourseSettingses_UserCourseSettingses_edges_node_user_progress
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node {
  __typename: "UserCourseSettings"
  id: string
  user: UserCourseSettingses_UserCourseSettingses_edges_node_user | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges {
  __typename: "UserCourseSettingsEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: UserCourseSettingses_UserCourseSettingses_edges_node | null
}

export interface UserCourseSettingses_UserCourseSettingses {
  __typename: "QueryUserCourseSettingses_Connection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: UserCourseSettingses_UserCourseSettingses_pageInfo
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges: (UserCourseSettingses_UserCourseSettingses_edges | null)[] | null
  count: number | null
}

export interface UserCourseSettingses {
  UserCourseSettingses: UserCourseSettingses_UserCourseSettingses | null
}

export interface UserCourseSettingsesVariables {
  course_id?: string | null
  cursor?: string | null
  search?: string | null
  course_string?: string | null
}
