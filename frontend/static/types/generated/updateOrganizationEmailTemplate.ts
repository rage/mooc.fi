/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateOrganizationEmailTemplate
// ====================================================

export interface updateOrganizationEmailTemplate_updateOrganizationEmailTemplate_join_organization_email_template {
  __typename: "EmailTemplate"
  id: string
}

export interface updateOrganizationEmailTemplate_updateOrganizationEmailTemplate {
  __typename: "Organization"
  id: string
  join_organization_email_template: updateOrganizationEmailTemplate_updateOrganizationEmailTemplate_join_organization_email_template | null
}

export interface updateOrganizationEmailTemplate {
  updateOrganizationEmailTemplate: updateOrganizationEmailTemplate_updateOrganizationEmailTemplate | null
}

export interface updateOrganizationEmailTemplateVariables {
  id: string
  email_template_id: string
}
