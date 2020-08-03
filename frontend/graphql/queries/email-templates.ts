import { gql } from "@apollo/client"

export const AllEmailTemplatesQuery = gql`
  query AllEmailTemplates {
    email_templates {
      id
      name
      txt_body
      html_body
      title
    }
  }
`

export const EmailTemplateQuery = gql`
  query EmailTemplate($id: ID!) {
    email_template(id: $id) {
      id
      created_at
      updated_at
      name
      txt_body
      html_body
      title
    }
  }
`
