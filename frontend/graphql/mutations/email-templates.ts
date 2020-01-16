import { gql } from "apollo-boost"

export const UpdateEmailTemplateMutation = gql`
  mutation UpdateEmailTemplate(
    $id: ID!
    $name: String
    $html_body: String
    $txt_body: String
    $title: String
  ) {
    updateEmailTemplate(
      id: $id
      name: $name
      html_body: $html_body
      txt_body: $txt_body
      title: $title
    ) {
      id
      name
      html_body
      txt_body
      title
    }
  }
`

export const AddEmailTemplateMutation = gql`
  mutation AddEmailTemplate(
    $name: String!
    $html_body: String
    $txt_body: String
    $title: String
  ) {
    addEmailTemplate(
      name: $name
      html_body: $html_body
      txt_body: $txt_body
      title: $title
    ) {
      id
      name
      html_body
      txt_body
      title
    }
  }
`

export const DeleteEmailTemplateMutation = gql`
  mutation DeleteEmailTemplate($id: ID!) {
    deleteEmailTemplate(id: $id) {
      id
      name
      html_body
      txt_body
      title
    }
  }
`
