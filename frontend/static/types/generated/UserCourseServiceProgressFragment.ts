/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCourseServiceProgressFragment
// ====================================================

export interface UserCourseServiceProgressFragment_service {
  __typename: "Service"
  name: string
  id: string
}

export interface UserCourseServiceProgressFragment {
  __typename: "UserCourseServiceProgress"
  progress: (any | null)[] | null
  service: UserCourseServiceProgressFragment_service | null
}
