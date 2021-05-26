import { gql } from "@apollo/client"

export const AllEmailTemplatesQuery = gql`
  query AllEmailTemplates {
    email_templates {
      id
      name
      txt_body
      html_body
      title
      template_type
      triggered_automatically_by_course_id
      exercise_completions_threshold
      points_threshold
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
      template_type
      triggered_automatically_by_course_id
      exercise_completions_threshold
      points_threshold
    }
  }
`
