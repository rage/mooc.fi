import { gql } from "@apollo/client"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: { order: asc }, language: $language) {
      id
      slug
      name
      order
      study_module_order
      photo {
        id
        compressed
        uncompressed
      }
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
`

export const AllEditorCoursesQuery = gql`
  query AllEditorCourses {
    courses(orderBy: { name: asc }) {
      id
      name
      slug
      order
      status
      hidden
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
    }
    currentUser {
      id
      administrator
    }
  }
`

export const CheckSlugQuery = gql`
  query checkSlug($slug: String!) {
    course_exists(slug: $slug)
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
