/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCourseSettingses
// ====================================================

export interface UserCourseSettingses_UserCourseSettingses_pageInfo {
  __typename: "PageInfo"
  hasNextPage: boolean
  endCursor: string | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_course {
  __typename: "Course"
  name: string
  id: any
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_progress_user {
  __typename: "User"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_progress {
  __typename: "UserCourseProgress"
  progress: any
  user: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_progress_user
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: any
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: any
  service: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_service_progresses_service
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses {
  __typename: "Progress"
  course: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_course
  user_course_progress: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_progress | null
  user_course_service_progresses: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses_user_course_service_progresses[]
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  progresses: UserCourseSettingses_UserCourseSettingses_edges_node_user_progresses[]
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node {
  __typename: "UserCourseSettings"
  id: any
  user: UserCourseSettingses_UserCourseSettingses_edges_node_user
}

export interface UserCourseSettingses_UserCourseSettingses_edges {
  __typename: "UserCourseSettingsEdge"
  node: UserCourseSettingses_UserCourseSettingses_edges_node
}

export interface UserCourseSettingses_UserCourseSettingses {
  __typename: "UserCourseSettingsConnection"
  pageInfo: UserCourseSettingses_UserCourseSettingses_pageInfo
  edges: UserCourseSettingses_UserCourseSettingses_edges[]
  count: number
}

export interface UserCourseSettingses {
  UserCourseSettingses: UserCourseSettingses_UserCourseSettingses
}

export interface UserCourseSettingsesVariables {
  course_id?: string | null
  cursor?: string | null
  search?: string | null
}
