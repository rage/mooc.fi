import { gql } from "apollo-boost"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: { id: asc }, language: $language) {
      id
      slug
      name
      order
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
      study_module {
        id
      }
      course_translation {
        id
        language
        name
      }
      user_course_settings_visibility {
        id
        language
      }
    }
  }
`

export const AllEditorCoursesQuery = gql`
  query AllEditorCourses {
    courses(orderBy: { id: asc }) {
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
      course_translation {
        id
        language
        name
      }
      course_variant {
        id
        slug
        description
      }
      course_alias {
        id
        course_code
      }
      user_course_settings_visibility {
        id
        language
      }
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
      course_translation {
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
