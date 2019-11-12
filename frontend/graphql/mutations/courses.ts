import { gql } from "apollo-boost"

export const AddCourseMutation = gql`
  mutation addCourse($course: CourseArg!) {
    addCourse(course: $course) {
      id
      slug
      ects
      name
      order
      study_module_order
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
      course_translations {
        id
        language
        name
        description
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
    }
  }
`

export const UpdateCourseMutation = gql`
  mutation updateCourse($course: CourseArg!) {
    updateCourse(course: $course) {
      id
      slug
      ects
      name
      order
      study_module_order
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
      course_translations {
        id
        language
        name
        description
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
    }
  }
`

export const DeleteCourseMutation = gql`
  mutation deleteCourse($id: ID) {
    deleteCourse(id: $id) {
      id
      slug
    }
  }
`
