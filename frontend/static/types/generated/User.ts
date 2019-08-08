/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_user_course_progressess {
  __typename: "UserCourseProgress";
  id: any;
}

export interface User_user {
  __typename: "User";
  id: any;
  user_course_progressess: User_user_user_course_progressess | null;
}

export interface User {
  user: User_user;
}

export interface UserVariables {
  email?: string | null;
  course_id?: string | null;
}
