/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrganizationById
// ====================================================

export interface OrganizationById_organization_organization_translations {
  __typename: "OrganizationTranslation"
  name: string
}

export interface OrganizationById_organization {
  __typename: "Organization"
  hidden: boolean | null
  organization_translations: OrganizationById_organization_organization_translations[]
}

export interface OrganizationById {
  /**
   * Get organization by id or slug. Admins can also query hidden courses. Fields that can be queried is more limited on normal users.
   */
  organization: OrganizationById_organization | null
}

export interface OrganizationByIdVariables {
  id: string
}
