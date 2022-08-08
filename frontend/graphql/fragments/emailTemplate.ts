import { gql } from "@apollo/client"

export const EmailTemplateCoreFieldsFragment = gql`
  fragment EmailTemplateCoreFields on EmailTemplate {
    id
    name
    title
    txt_body
    html_body
    template_type
    created_at
    updated_at
  }
`

export const EmailTemplateFieldsFragment = gql`
  fragment EmailTemplateFields on EmailTemplate {
    ...EmailTemplateCoreFields
    triggered_automatically_by_course_id
    exercise_completions_threshold
    points_threshold
  }
  ${EmailTemplateCoreFieldsFragment}
`
