import { CourseTagFragment } from "/graphql/fragments/courseTag"

import { gql } from "@apollo/client"

export const UserCourseFragment = gql`
  fragment UserCourseFragment on Course {
    id
    slug
    name
    order
    status
    hidden
    study_module_order
    photo {
      id
      compressed
      uncompressed
    }
    promote
    start_point
    study_module_start_point
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
    course_tags {
      tag {
        id
        color
        tag_translations {
          language
          name
          description
        }
      }
    }
  }
`

export const AdminCourseFragment = gql`
  fragment AdminCourseFragment on Course {
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
    photo {
      id
      compressed
      uncompressed
    }
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
    course_tags {
      ...CourseTagFragment
    }
  }
  ${CourseTagFragment}
`

export const AdminDetailedCourseFragment = gql`
  fragment AdminDetailedCourseFragment on Course {
    id
    name
    slug
    hidden
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
    course_tags {
      ...CourseTagFragment
    }
  }
  ${CourseTagFragment}
`

export const CourseEmailDetailsFragment = gql`
  fragment CourseEmailDetailsFragment on Course {
    id
    slug
    name
    teacher_in_charge_name
    teacher_in_charge_email
    start_date
    completion_email {
      name
      id
    }
    course_stats_email {
      id
      name
    }
  }
`
