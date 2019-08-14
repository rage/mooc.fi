/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPoints
// ====================================================

export interface UserPoints_currentUser_user_course_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserPoints_currentUser_user_course_progresses {
  __typename: "UserCourseProgress"
  course: UserPoints_currentUser_user_course_progresses_course
  progress: any
}

export interface UserPoints_currentUser {
  __typename: "User"
  id: any
  user_course_progresses: UserPoints_currentUser_user_course_progresses[] | null
}

export interface UserPoints {
  currentUser: UserPoints_currentUser | null
}
