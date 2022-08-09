import { gql } from "@apollo/client"

import {
  CourseCoreFieldsFragment,
  CourseFieldsFragment,
  EditorCourseDetailedFieldsFragment,
  EditorCourseFieldsFragment,
  EditorCourseOtherCoursesFieldsFragment,
} from "/graphql/fragments/course"
import { EmailTemplateCoreFieldsFragment } from "/graphql/fragments/emailTemplate"

export const CoursesQuery = gql`
  query Courses($language: String) {
    courses(orderBy: { order: asc }, language: $language) {
      ...CourseFields
      user_course_settings_visibilities {
        id
        language
      }
    }
  }
  ${CourseFieldsFragment}
`

export const EditorCoursesQuery = gql`
  query EditorCourses(
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
      ...EditorCourseFields
    }
    currentUser {
      id
      administrator
    }
  }
  ${EditorCourseFieldsFragment}
`

export const CourseFromSlugQuery = gql`
  query CourseFromSlug($slug: String!) {
    course(slug: $slug) {
      ...CourseCoreFields
      description
      instructions
    }
  }
  ${CourseCoreFieldsFragment}
`

export const CourseEditorOtherCoursesQuery = gql`
  query CourseEditorOtherCourses {
    courses {
      ...EditorCourseOtherCoursesFields
    }
  }
  ${EditorCourseOtherCoursesFieldsFragment}
`

export const HandlerCoursesQuery = gql`
  query HandlerCourses {
    handlerCourses {
      ...CourseCoreFields
    }
  }
  ${CourseCoreFieldsFragment}
`

export const CourseEditorDetailsQuery = gql`
  query CourseEditorDetails($slug: String) {
    course(slug: $slug) {
      ...EditorCourseDetailedFields
    }
  }
  ${EditorCourseDetailedFieldsFragment}
`

export const EmailTemplateEditorCoursesQuery = gql`
  query EmailTemplateEditorCourses {
    courses {
      ...CourseCoreFields
      teacher_in_charge_name
      teacher_in_charge_email
      start_date
      completion_email {
        ...EmailTemplateCoreFields
      }
      course_stats_email {
        ...EmailTemplateCoreFields
      }
    }
  }
  ${CourseCoreFieldsFragment}
  ${EmailTemplateCoreFieldsFragment}
`

export const CourseDashboardQuery = gql`
  query CourseDashboard($slug: String!) {
    course(slug: $slug) {
      ...CourseCoreFields
      teacher_in_charge_name
      teacher_in_charge_email
      start_date
      completion_email {
        ...EmailTemplateCoreFields
      }
      course_stats_email {
        ...EmailTemplateCoreFields
      }
    }
  }
  ${CourseCoreFieldsFragment}
  ${EmailTemplateCoreFieldsFragment}
`
