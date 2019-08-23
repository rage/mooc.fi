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

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses_service {
  __typename: "Service"
  id: any
  name: string
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  course: UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses_course
  service: UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses_service
  progress: any
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses {
  __typename: "UserCourseProgress"
  id: any
  course: UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_course
  progress: any
  user_course_service_progresses:
    | UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses_user_course_service_progresses[]
    | null
}

export interface UserCourseSettingses_UserCourseSettingses_edges_node_user {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  user_course_progresses:
    | UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses[]
    | null
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
}

export interface UserCourseSettingses {
  UserCourseSettingses: UserCourseSettingses_UserCourseSettingses
}

export interface UserCourseSettingsesVariables {
  course_id?: string | null
  cursor?: string | null
}
