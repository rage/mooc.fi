/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteEmailTemplate
// ====================================================

export interface DeleteEmailTemplate_deleteEmailTemplate {
  __typename: "EmailTemplate"
  id: string
  name: string | null
  html_body: string | null
  txt_body: string | null
  title: string | null
}

export interface DeleteEmailTemplate {
  deleteEmailTemplate: DeleteEmailTemplate_deleteEmailTemplate | null
}

export interface DeleteEmailTemplateVariables {
  id: string
}
