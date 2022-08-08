import { gql } from "@apollo/client"

import {
  UserCoreFieldsFragment,
  UserDetailedFieldsFragment,
  UserOverviewFieldsFragment,
  UserProgressesFieldsFragment,
} from "/graphql/fragments/user"
import { UserCourseSummaryCoreFieldsFragment } from "/graphql/fragments/userCourseSummary"

export const CurrentUserQuery = gql`
  query CurrentUser {
    currentUser {
      ...UserCoreFields
    }
  }
  ${UserCoreFieldsFragment}
`

export const CurrentUserDetailedQuery = gql`
  query CurrentUserDetailed {
    currentUser {
      ...UserDetailedFields
    }
  }
  ${UserDetailedFieldsFragment}
`

export const CurrentUserStatsSubscriptionsQuery = gql`
  query CurrentUserStatsSubscriptions {
    currentUser {
      id
      course_stats_subscriptions {
        id
        email_template {
          id
        }
      }
    }
  }
`

export const UserSummaryQuery = gql`
  query UserSummary($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      user_course_summary {
        ...UserCourseSummaryCoreFields
      }
    }
  }
  ${UserCourseSummaryCoreFieldsFragment}
`

export const CurrentUserOverviewQuery = gql`
  query CurrentUserUserOverview {
    currentUser {
      ...UserOverviewFields
    }
  }
  ${UserOverviewFieldsFragment}
`

export const UserOverviewQuery = gql`
  query UserOverview($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      ...UserOverviewFields
    }
  }
  ${UserOverviewFieldsFragment}
`
export const CurrentUserProgressesQuery = gql`
  query UserProgresses {
    currentUser {
      ...UserProgressesFields
    }
  }
  ${UserProgressesFieldsFragment}
`

export const UserDetailsContainsQuery = gql`
  query UserDetailsContains(
    $search: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $skip: Int
  ) {
    userDetailsContains(
      search: $search
      first: $first
      last: $last
      before: $before
      after: $after
      skip: $skip
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...UserCoreFields
        }
      }
      count(search: $search)
    }
  }
  ${UserCoreFieldsFragment}
`

export const ConnectedUserQuery = gql`
  query ConnectedUser {
    currentUser {
      ...UserCoreFields
      verified_users {
        id
        created_at
        updated_at
        display_name
        organization {
          id
          organization_translations {
            language
            name
          }
        }
      }
    }
  }
  ${UserCoreFieldsFragment}
`

export const ConnectionTestQuery = gql`
  query ConnectionTest {
    currentUser {
      ...UserCoreFields
      verified_users {
        id
        organization {
          slug
          organization_translations {
            language
            name
          }
        }
        created_at
        personal_unique_code
        display_name
      }
    }
  }
  ${UserCoreFieldsFragment}
`
