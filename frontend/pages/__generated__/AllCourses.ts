/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCourses
// ====================================================

export interface AllCourses_courses_photo {
  __typename: "Image";
  id: any;
  compressed: string | null;
  uncompressed: string;
}

export interface AllCourses_courses {
  __typename: "Course";
  id: any;
  name: string;
  slug: string;
  photo: AllCourses_courses_photo | null;
}

export interface AllCourses_currentUser {
  __typename: "User";
  id: any;
  administrator: boolean;
}

export interface AllCourses {
  courses: AllCourses_courses[];
  currentUser: AllCourses_currentUser;
}
