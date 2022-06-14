import { gql } from "@apollo/client"
import {
  UserOrganizationFragment,
  UserOrganizationJoinConfirmationFragment,
} from "../fragments/userOrganization"

export const OrganizationsQuery = gql`
  query Organizations {
    organizations {
      id
      slug
      hidden
      required_confirmation
      required_organization_email
      organization_translations {
        language
        name
        information
      }
    }
  }
`

export const UserOrganizationsQuery = gql`
  query UserOrganizations {
    userOrganizations {
      ...UserOrganizationFragment
      user_organization_join_confirmations {
        ...UserOrganizationJoinConfirmationFragment
      }
    }
  }
  ${UserOrganizationFragment}
  ${UserOrganizationJoinConfirmationFragment}
`

export const OrganizationByIdQuery = gql`
  query OrganizationById($id: ID!) {
    organization(id: $id) {
      hidden
      organization_translations {
        name
      }
    }
  }
`

export const AddUserOrganizationMutation = gql`
  mutation addUserOrganization($user_id: ID!, $organization_id: ID!) {
    addUserOrganization(user_id: $user_id, organization_id: $organization_id) {
      id
    }
  }
`

export const UpdateUserOrganizationMutation = gql`
  mutation updateUserOrganization($id: ID!, $role: OrganizationRole) {
    updateUserOrganization(id: $id, role: $role) {
      id
    }
  }
`

export const DeleteUserOrganizationMutation = gql`
  mutation deleteUserOrganization($id: ID!) {
    deleteUserOrganization(id: $id) {
      id
    }
  }
`
