/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserDetailsContains
// ====================================================

export interface UserDetailsContains_userDetailsContains_pageInfo {
  __typename: "PageInfo"
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserDetailsContains_userDetailsContains_edges_node {
  __typename: "User"
  id: any
  email: string
  student_number: string | null
  real_student_number: string | null
  upstream_id: number
  first_name: string | null
  last_name: string | null
}

export interface UserDetailsContains_userDetailsContains_edges {
  __typename: "UserEdge"
  node: UserDetailsContains_userDetailsContains_edges_node
}

export interface UserDetailsContains_userDetailsContains {
  __typename: "UserConnection"
  pageInfo: UserDetailsContains_userDetailsContains_pageInfo
  edges: UserDetailsContains_userDetailsContains_edges[]
  count: number
}

export interface UserDetailsContains {
  userDetailsContains: UserDetailsContains_userDetailsContains
}

export interface UserDetailsContainsVariables {
  search: string
  before?: string | null
  after?: string | null
  first?: number | null
  last?: number | null
  skip?: number | null
}
