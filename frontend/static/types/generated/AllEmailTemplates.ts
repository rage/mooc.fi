/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEmailTemplates
// ====================================================

export interface AllEmailTemplates_email_templates {
  __typename: "EmailTemplate"
  id: string
  name: string | null
  txt_body: string | null
  html_body: string | null
  title: string | null
  template_type: string | null
  triggered_automatically_by_course_id: string | null
  exercise_completions_threshold: number | null
  points_threshold: number | null
}

export interface AllEmailTemplates {
  email_templates: (AllEmailTemplates_email_templates | null)[] | null
}
