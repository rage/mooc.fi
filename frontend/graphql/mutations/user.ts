import { gql } from "@apollo/client"

import { UserCoreFieldsFragment } from "/graphql/fragments/user"

export const UpdateUserNameMutation = gql`
  mutation UpdateUserName($first_name: String, $last_name: String) {
    updateUserName(first_name: $first_name, last_name: $last_name) {
      ...UserCoreFields
    }
  }
  ${UserCoreFieldsFragment}
`

export const UpdateResearchConsentMutation = gql`
  mutation UpdateResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

export const UserCourseStatsSubscribeMutation = gql`
  mutation UserCourseStatsSubscribe($id: ID!) {
    createCourseStatsSubscription(id: $id) {
      id
    }
  }
`

export const UserCourseStatsUnsubscribeMutation = gql`
  mutation UserCourseStatsUnsubscribe($id: ID!) {
    deleteCourseStatsSubscription(id: $id) {
      id
    }
  }
`
