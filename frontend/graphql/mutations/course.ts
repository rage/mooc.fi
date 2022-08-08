import { gql } from "@apollo/client"

import {
  CourseCoreFieldsFragment,
  EditorCourseDetailedFieldsFragment,
} from "/graphql/fragments/course"
import { EmailTemplateCoreFieldsFragment } from "/graphql/fragments/emailTemplate"

export const AddCourseMutation = gql`
  mutation AddCourse($course: CourseCreateArg!) {
    addCourse(course: $course) {
      ...EditorCourseDetailedFields
    }
  }
  ${EditorCourseDetailedFieldsFragment}
`

export const UpdateCourseMutation = gql`
  mutation UpdateCourse($course: CourseUpsertArg!) {
    updateCourse(course: $course) {
      ...EditorCourseDetailedFields
      completion_email {
        ...EmailTemplateCoreFields
      }
      course_stats_email {
        ...EmailTemplateCoreFields
      }
    }
  }
  ${EditorCourseDetailedFieldsFragment}
  ${EmailTemplateCoreFieldsFragment}
`

export const DeleteCourseMutation = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      ...CourseCoreFields
    }
  }
  ${CourseCoreFieldsFragment}
`
