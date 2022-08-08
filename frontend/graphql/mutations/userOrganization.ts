import { gql } from "@apollo/client"

export const AddUserOrganizationMutation = gql`
  mutation AddUserOrganization($user_id: ID!, $organization_id: ID!) {
    addUserOrganization(user_id: $user_id, organization_id: $organization_id) {
      id
    }
  }
`

export const UpdateUserOrganizationMutation = gql`
  mutation UpdateUserOrganization($id: ID!, $role: OrganizationRole) {
    updateUserOrganization(id: $id, role: $role) {
      id
    }
  }
`

export const DeleteUserOrganizationMutation = gql`
  mutation DeleteUserOrganization($id: ID!) {
    deleteUserOrganization(id: $id) {
      id
    }
  }
`
