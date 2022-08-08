import { gql } from "@apollo/client"

import { EmailTemplateFieldsFragment } from "/graphql/fragments/emailTemplate"

export const EmailTemplatesQuery = gql`
  query EmailTemplates {
    email_templates {
      ...EmailTemplateFields
    }
  }
  ${EmailTemplateFieldsFragment}
`

export const EmailTemplateQuery = gql`
  query EmailTemplate($id: ID!) {
    email_template(id: $id) {
      ...EmailTemplateFields
    }
  }
  ${EmailTemplateFieldsFragment}
`
