/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateEmailTemplate
// ====================================================

export interface UpdateEmailTemplate_updateEmailTemplate {
  __typename: "EmailTemplate"
  id: any
  name: string | null
  html_body: string | null
  txt_body: string | null
  title: string | null
}

export interface UpdateEmailTemplate {
  updateEmailTemplate: UpdateEmailTemplate_updateEmailTemplate
}

export interface UpdateEmailTemplateVariables {
  id: string
  name?: string | null
  html_body?: string | null
  txt_body?: string | null
  title?: string | null
}
