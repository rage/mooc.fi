/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Organizations
// ====================================================

export interface Organizations_organizations_organization_translation {
  __typename: "OrganizationTranslation"
  language: string
  name: string
  information: string | null
}

export interface Organizations_organizations {
  __typename: "Organization"
  id: string
  slug: string
  hidden: boolean | null
  organization_translation: Organizations_organizations_organization_translation[]
}

export interface Organizations {
  organizations: Organizations_organizations[] | null
}
