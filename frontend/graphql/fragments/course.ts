import { gql } from "@apollo/client"

import { ImageCoreFieldsFragment } from "/graphql/fragments/image"
import { OpenUniversityRegistrationLinkCoreFieldsFragment } from "/graphql/fragments/openUniversityRegistrationLink"
import { StudyModuleCoreFieldsFragment } from "/graphql/fragments/studyModule"

export const CourseCoreFieldsFragment = gql`
  fragment CourseCoreFields on Course {
    id
    slug
    name
    ects
    created_at
    updated_at
  }
`

export const CourseWithPhotoCoreFieldsFragment = gql`
  fragment CourseWithPhotoCoreFields on Course {
    ...CourseCoreFields
    photo {
      ...ImageCoreFields
    }
  }
  ${CourseCoreFieldsFragment}
  ${ImageCoreFieldsFragment}
`

export const CourseTranslationCoreFieldsFragment = gql`
  fragment CourseTranslationCoreFields on CourseTranslation {
    id
    course_id
    language
    name
    description
    link
    created_at
    updated_at
  }
`

export const CourseFieldsFragment = gql`
  fragment CourseFields on Course {
    ...CourseWithPhotoCoreFields
    description
    link
    order
    study_module_order
    promote
    status
    start_point
    study_module_start_point
    hidden
    upcoming_active_link
    tier
    support_email
    teacher_in_charge_email
    teacher_in_charge_name
    start_date
    end_date
    course_translations {
      ...CourseTranslationCoreFields
    }
    study_modules {
      ...StudyModuleCoreFields
    }
    photo {
      ...ImageCoreFields
    }
  }
  ${CourseWithPhotoCoreFieldsFragment}
  ${CourseTranslationCoreFieldsFragment}
  ${StudyModuleCoreFieldsFragment}
`

export const EditorCourseFieldsFragment = gql`
  fragment EditorCourseFields on Course {
    ...CourseFields
    instructions
    has_certificate
    upcoming_active_link
    completions_handled_by {
      ...CourseCoreFields
    }
    course_variants {
      id
      slug
      description
    }
    course_aliases {
      id
      course_code
    }
    user_course_settings_visibilities {
      id
      language
    }
  }
  ${CourseFieldsFragment}
  ${CourseCoreFieldsFragment}
`

export const EditorCourseDetailedFieldsFragment = gql`
  fragment EditorCourseDetailedFields on Course {
    ...EditorCourseFields
    course_translations {
      ...CourseTranslationCoreFields
      description
      instructions
      link
    }
    open_university_registration_links {
      ...OpenUniversityRegistrationLinkCoreFields
    }
    inherit_settings_from {
      id
    }
    automatic_completions
    automatic_completions_eligible_for_ects
    exercise_completions_needed
    points_needed
  }
  ${EditorCourseFieldsFragment}
  ${CourseTranslationCoreFieldsFragment}
  ${OpenUniversityRegistrationLinkCoreFieldsFragment}
`

export const EditorCourseOtherCoursesFieldsFragment = gql`
  fragment EditorCourseOtherCoursesFields on Course {
    ...CourseWithPhotoCoreFields
    course_translations {
      ...CourseTranslationCoreFields
    }
  }
  ${CourseWithPhotoCoreFieldsFragment}
  ${CourseTranslationCoreFieldsFragment}
`
