/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateEmailTemplate
// ====================================================

export interface UpdateEmailTemplate_updateEmailTemplate {
  __typename: "EmailTemplate"
  id: string
  name: string | null
  html_body: string | null
  txt_body: string | null
  title: string | null
  type: string | null
  points_threshold: number | null
  execise_completions_threshold: number | null
  triggered_automatically_by_course_id: string | null
}

export interface UpdateEmailTemplate {
  updateEmailTemplate: UpdateEmailTemplate_updateEmailTemplate | null
}

export interface UpdateEmailTemplateVariables {
  id: string
  name?: string | null
  html_body?: string | null
  txt_body?: string | null
  title?: string | null
}
