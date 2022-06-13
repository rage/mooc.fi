/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserOrganizationFragment
// ====================================================

export interface UserOrganizationFragment_organization_organization_translations {
  __typename: "OrganizationTranslation"
  language: string
  name: string
  information: string | null
}

export interface UserOrganizationFragment_organization {
  __typename: "Organization"
  id: string
  slug: string
  hidden: boolean | null
  required_confirmation: boolean | null
  required_organization_email: string | null
  organization_translations: UserOrganizationFragment_organization_organization_translations[]
}

export interface UserOrganizationFragment {
  __typename: "UserOrganization"
  id: string
  confirmed: boolean | null
  consented: boolean | null
  organization: UserOrganizationFragment_organization | null
}
