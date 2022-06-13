import {
  UserOrganizationFragment,
  UserOrganizationJoinConfirmationFragment,
} from "/graphql/fragments/userOrganization"

import { gql } from "@apollo/client"

export const addUserOrganizationMutation = gql`
  mutation addUserOrganization(
    $organization_id: ID!
    $email: String
    $redirect: String
    $language: String
  ) {
    addUserOrganization(
      organization_id: $organization_id
      email: $email
      redirect: $redirect
      language: $language
    ) {
      ...UserOrganizationFragment
      user_organization_join_confirmations {
        ...UserOrganizationJoinConfirmationFragment
      }
    }
  }
  ${UserOrganizationFragment}
  ${UserOrganizationJoinConfirmationFragment}
`

export const updateUserOrganizationMutation = gql`
  mutation updateUserOrganization(
    $id: ID!
    $role: OrganizationRole
    $consented: Boolean
  ) {
    updateUserOrganization(id: $id, role: $role, consented: $consented) {
      id
      role
      consented
    }
  }
`

export const deleteUserOrganizationMutation = gql`
  mutation deleteUserOrganization($id: ID!) {
    deleteUserOrganization(id: $id) {
      id
    }
  }
`

export const confirmUserOrganizationJoinMutation = gql`
  mutation confirmUserOrganizationJoin($id: ID!, $code: String!) {
    confirmUserOrganizationJoin(id: $id, code: $code) {
      ...UserOrganizationJoinConfirmationFragment
    }
  }
  ${UserOrganizationJoinConfirmationFragment}
`

export const refreshUserOrganizatoinJoinConfirmationMutation = gql`
  mutation refreshUserOrganizationJoinConfirmation($id: ID!) {
    refreshUserOrganizationJoinConfirmation(id: $id) {
      ...UserOrganizationJoinConfirmationFragment
    }
  }
  ${UserOrganizationJoinConfirmationFragment}
`
