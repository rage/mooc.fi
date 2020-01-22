/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEmailTemplates
// ====================================================

export interface AllEmailTemplates_email_templates {
  __typename: "EmailTemplate";
  id: any;
  name: string | null;
  txt_body: string | null;
  html_body: string | null;
  title: string | null;
}

export interface AllEmailTemplates {
  email_templates: AllEmailTemplates_email_templates[];
}
