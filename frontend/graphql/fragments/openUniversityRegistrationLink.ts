import { gql } from "@apollo/client"

export const OpenUniversityRegistrationLinkCoreFieldsFragment = gql`
  fragment OpenUniversityRegistrationLinkCoreFields on OpenUniversityRegistrationLink {
    id
    course_code
    language
    link
  }
`
