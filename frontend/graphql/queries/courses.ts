import { gql } from "@apollo/client"

import { CoursePhotoFragment } from "/graphql/fragments/course"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: { order: asc }, language: $language) {
      id
      slug
      name
      order
      study_module_order
      ...CoursePhoto
      promote
      status
      start_point
      study_module_start_point
      hidden
      description
      link
      upcoming_active_link
      study_modules {
        id
        slug
      }
      course_translations {
        id
        language
        name
      }
      user_course_settings_visibilities {
        id
        language
      }
    }
  }
  ${CoursePhotoFragment}
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
      id
      name
      slug
      order
      status
      hidden
      tier
      instructions
      completions_handled_by {
        id
      }
      start_date
      end_date
      support_email
      teacher_in_charge_email
      teacher_in_charge_name
      ...CoursePhoto
      course_translations {
        id
        language
        name
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
      upcoming_active_link
    }
    currentUser {
      id
      administrator
    }
  }
  ${CoursePhotoFragment}
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
      id
      name
      slug
      ects
      order
      study_module_order
      teacher_in_charge_name
      teacher_in_charge_email
      support_email
      start_date
      end_date
      tier
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      promote
      start_point
      hidden
      study_module_start_point
      status
      course_translations {
        id
        name
        language
        description
        instructions
        link
      }
      open_university_registration_links {
        id
        course_code
        language
        link
      }
      study_modules {
        id
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
      inherit_settings_from {
        id
      }
      completions_handled_by {
        id
      }
      has_certificate
      user_course_settings_visibilities {
        id
        language
      }
      upcoming_active_link
      automatic_completions
      automatic_completions_eligible_for_ects
      exercise_completions_needed
      points_needed
    }
  }
`
