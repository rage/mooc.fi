/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteEmailTemplate
// ====================================================

export interface DeleteEmailTemplate_deleteEmailTemplate {
  __typename: "EmailTemplate"
  id: any
  name: string | null
  html_body: string | null
  txt_body: string | null
  title: string | null
}

export interface DeleteEmailTemplate {
  deleteEmailTemplate: DeleteEmailTemplate_deleteEmailTemplate
}

export interface DeleteEmailTemplateVariables {
  id: string
}
