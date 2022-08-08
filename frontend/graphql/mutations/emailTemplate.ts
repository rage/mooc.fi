import { gql } from "@apollo/client"

import {
  EmailTemplateCoreFieldsFragment,
  EmailTemplateFieldsFragment,
} from "/graphql/fragments/emailTemplate"

export const UpdateEmailTemplateMutation = gql`
  mutation UpdateEmailTemplate(
    $id: ID!
    $name: String
    $html_body: String
    $txt_body: String
    $title: String
    $template_type: String
    $triggered_automatically_by_course_id: String
    $exercise_completions_threshold: Int
    $points_threshold: Int
  ) {
    updateEmailTemplate(
      id: $id
      name: $name
      html_body: $html_body
      txt_body: $txt_body
      title: $title
      template_type: $template_type
      triggered_automatically_by_course_id: $triggered_automatically_by_course_id
      exercise_completions_threshold: $exercise_completions_threshold
      points_threshold: $points_threshold
    ) {
      ...EmailTemplateFields
    }
  }
  ${EmailTemplateFieldsFragment}
`

export const AddEmailTemplateMutation = gql`
  mutation AddEmailTemplate(
    $name: String!
    $html_body: String
    $txt_body: String
    $title: String
    $template_type: String
    $triggered_automatically_by_course_id: String
    $exercise_completions_threshold: Int
    $points_threshold: Int
  ) {
    addEmailTemplate(
      name: $name
      html_body: $html_body
      txt_body: $txt_body
      title: $title
      template_type: $template_type
      triggered_automatically_by_course_id: $triggered_automatically_by_course_id
      exercise_completions_threshold: $exercise_completions_threshold
      points_threshold: $points_threshold
    ) {
      ...EmailTemplateFields
    }
  }
  ${EmailTemplateFieldsFragment}
`

export const DeleteEmailTemplateMutation = gql`
  mutation DeleteEmailTemplate($id: ID!) {
    deleteEmailTemplate(id: $id) {
      ...EmailTemplateCoreFields
    }
  }
  ${EmailTemplateCoreFieldsFragment}
`
