import { gql } from "apollo-boost"

export const AddCourseMutation = gql`
  mutation addCourse(
    $name: String
    $slug: String
    $ects: String
    $new_photo: Upload
    $base64: Boolean
    $promote: Boolean
    $start_point: Boolean
    $hidden: Boolean
    $study_module_start_point: Boolean
    $status: CourseStatus
    $course_translations: [CourseTranslationCreateWithoutCourseInput!]
    $open_university_registration_links: [OpenUniversityRegistrationLinkCreateWithoutCourseInput!]
    $study_modules: [StudyModuleWhereUniqueInput!]
    $course_variants: [CourseVariantCreateWithoutCourseInput!]
    $order: Int
    $study_module_order: Int
  ) {
    addCourse(
      name: $name
      slug: $slug
      ects: $ects
      new_photo: $new_photo
      base64: $base64
      promote: $promote
      start_point: $start_point
      hidden: $hidden
      study_module_start_point: $study_module_start_point
      status: $status
      course_translations: $course_translations
      open_university_registration_links: $open_university_registration_links
      study_modules: $study_modules
      course_variants: $course_variants
      order: $order
      study_module_order: $study_module_order
    ) {
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
      course_variants {
        id
        slug
        description
      }
    }
  }
`

export const UpdateCourseMutation = gql`
  mutation updateCourse(
    $id: ID
    $name: String
    $slug: String
    $ects: String
    $photo: ID
    $new_photo: Upload
    $base64: Boolean
    $promote: Boolean
    $start_point: Boolean
    $hidden: Boolean
    $study_module_start_point: Boolean
    $status: CourseStatus
    $new_slug: String
    $course_translations: [CourseTranslationWithIdInput!]
    $open_university_registration_links: [OpenUniversityRegistrationLinkWithIdInput!]
    $study_modules: [StudyModuleWhereUniqueInput!]
    $course_variants: [CourseVariantWithIdInput!]
    $order: Int
    $study_module_order: Int
  ) {
    updateCourse(
      id: $id
      name: $name
      slug: $slug
      new_slug: $new_slug
      ects: $ects
      photo: $photo
      new_photo: $new_photo
      base64: $base64
      promote: $promote
      start_point: $start_point
      hidden: $hidden
      study_module_start_point: $study_module_start_point
      status: $status
      course_translations: $course_translations
      open_university_registration_links: $open_university_registration_links
      study_modules: $study_modules
      course_variants: $course_variants
      order: $order
      study_module_order: $study_module_order
    ) {
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
      course_variants {
        id
        slug
        description
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
