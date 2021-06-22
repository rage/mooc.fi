/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EmailTemplate
// ====================================================

export interface EmailTemplate_email_template {
  __typename: "EmailTemplate";
  id: string;
  created_at: any | null;
  updated_at: any | null;
  name: string | null;
  txt_body: string | null;
  html_body: string | null;
  title: string | null;
  template_type: string | null;
  triggered_automatically_by_course_id: string | null;
  exercise_completions_threshold: number | null;
  points_threshold: number | null;
}

export interface EmailTemplate {
  email_template: EmailTemplate_email_template | null;
}

export interface EmailTemplateVariables {
  id: string;
}
