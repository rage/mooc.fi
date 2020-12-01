/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettings
// ====================================================

export interface UserCourseSettings_userCourseSettings_pageInfo {
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

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_course {
  __typename: "Course"
  name: string
  id: string
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress_exercise_progress {
  __typename: "ExerciseProgress"
  total: number | null
  exercises: number | null
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress_user {
  __typename: "User"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress {
  __typename: "UserCourseProgress"
  progress: (any | null)[] | null
  exercise_progress: UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress_exercise_progress | null
  user: UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress_user | null
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: string
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: (any | null)[] | null
  service: UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_service_progresses_service | null
}

export interface UserCourseSettings_userCourseSettings_edges_node_user_progress {
  __typename: "Progress"
  course: UserCourseSettings_userCourseSettings_edges_node_user_progress_course | null
  user_course_progress: UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_progress | null
  user_course_service_progresses:
    | (UserCourseSettings_userCourseSettings_edges_node_user_progress_user_course_service_progresses | null)[]
    | null
}

export interface UserCourseSettings_userCourseSettings_edges_node_user {
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  real_student_number: string | null
  progress: UserCourseSettings_userCourseSettings_edges_node_user_progress
}

export interface UserCourseSettings_userCourseSettings_edges_node {
  __typename: "UserCourseSetting"
  id: string
  user: UserCourseSettings_userCourseSettings_edges_node_user | null
}

export interface UserCourseSettings_userCourseSettings_edges {
  __typename: "UserCourseSettingEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: UserCourseSettings_userCourseSettings_edges_node | null
}

export interface UserCourseSettings_userCourseSettings {
  __typename: "QueryUserCourseSettings_type_Connection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: UserCourseSettings_userCourseSettings_pageInfo
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges: (UserCourseSettings_userCourseSettings_edges | null)[] | null
  totalCount: number | null
}

export interface UserCourseSettings {
  userCourseSettings: UserCourseSettings_userCourseSettings | null
}

export interface UserCourseSettingsVariables {
  course_id: string
  skip?: number | null
  search?: string | null
}
