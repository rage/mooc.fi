import { gql } from "apollo-boost"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: order_ASC, language: $language) {
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
      study_modules {
        id
      }
      course_translations {
        id
        language
        name
      }
    }
  }
`

export const AllEditorCoursesQuery = gql`
  query AllEditorCourses {
    courses(orderBy: order_ASC) {
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
    }
    currentUser {
      id
      administrator
    }
  }
`

export const CheckSlugQuery = gql`
  query checkSlug($slug: String) {
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
