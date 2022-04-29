import {
  AdminCourseFragment,
  AdminDetailedCourseFragment,
  CourseEmailDetailsFragment,
  UserCourseFragment,
} from "/graphql/fragments/course"

import { gql } from "@apollo/client"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: { order: asc }, language: $language) {
      ...UserCourseFragment
    }
    ${UserCourseFragment}
  }
`

export const AllEditorCoursesQuery = gql`
  query AllEditorCourses(
    $search: String
    $hidden: Boolean
    $handledBy: String
    $status: [CourseStatus!]
  ) {
    courses(
      orderBy: { name: asc }
      search: $search
      hidden: $hidden
      handledBy: $handledBy
      status: $status
    ) {
      ...AdminCourseFragment
    }
    currentUser {
      id
      administrator
    }
  }
  ${AdminCourseFragment}
`

export const CheckSlugQuery = gql`
  query CheckSlug($slug: String!) {
    course(slug: $slug) {
      id
      slug
      name
      description
      instructions
    }
  }
`

export const CourseEditorStudyModuleQuery = gql`
  query CourseEditorStudyModules {
    study_modules {
      id
      name
      slug
    }
  }
`
export const CourseEditorCoursesQuery = gql`
  query CourseEditorCourses {
    courses {
      id
      slug
      name
      course_translations {
        id
        name
        language
      }
      photo {
        id
        name
        original
        original_mimetype
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
    }
  }
`

export const HandlerCoursesQuery = gql`
  query HandlerCourses {
    handlerCourses {
      id
      slug
      name
    }
  }
`

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      ...AdminDetailedCourseFragment
    }
  }
  ${AdminDetailedCourseFragment}
`

export const CourseEmailDetailsQuery = gql`
  query CourseEmailDetails($slug: String) {
    course(slug: $slug) {
      ...CourseEmailDetailsFragment
    }
  }
  ${CourseEmailDetailsFragment}
`

export const AllCourseEmailDetailsQuery = gql`
  query AllCourseEmailDetails {
    courses {
      ...CourseEmailDetailsFragment
    }
  }
  ${CourseEmailDetailsFragment}
`
