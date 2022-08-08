import { gql } from "@apollo/client"

export const OrganizationCoreFieldsFragment = gql`
  fragment OrganizationCoreFields on Organization {
    id
    slug
    hidden
    created_at
    updated_at
    # required_confirmation
    # required_organization_email
    organization_translations {
      id
      organization_id
      language
      name
      information
    }
  }
`
