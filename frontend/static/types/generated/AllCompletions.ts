/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCompletions
// ====================================================

export interface AllCompletions_completionsPaginated_pageInfo {
  __typename: "PageInfo"
  /**
   * Used to indicate whether more edges exist following the set defined by the clients arguments.
   */
  hasNextPage: boolean
  /**
   * Used to indicate whether more edges exist prior to the set defined by the clients arguments.
   */
  hasPreviousPage: boolean
  /**
   * The cursor corresponding to the first nodes in edges. Null if the connection is empty.
   */
  startCursor: string | null
  /**
   * The cursor corresponding to the last nodes in edges. Null if the connection is empty.
   */
  endCursor: string | null
}

export interface AllCompletions_completionsPaginated_edges_node_user {
  __typename: "user"
  id: string
  first_name: string | null
  last_name: string | null
  student_number: string | null
}

export interface AllCompletions_completionsPaginated_edges_node_course {
  __typename: "course"
  id: string
  name: string
}

export interface AllCompletions_completionsPaginated_edges_node_completion_registered_organization {
  __typename: "organization"
  id: string
  slug: string
}

export interface AllCompletions_completionsPaginated_edges_node_completion_registered {
  __typename: "completion_registered"
  id: string
  organization: AllCompletions_completionsPaginated_edges_node_completion_registered_organization | null
}

export interface AllCompletions_completionsPaginated_edges_node {
  __typename: "completion"
  id: string
  email: string
  completion_language: string | null
  created_at: any | null
  user: AllCompletions_completionsPaginated_edges_node_user | null
  course: AllCompletions_completionsPaginated_edges_node_course | null
  completion_registered: AllCompletions_completionsPaginated_edges_node_completion_registered[]
}

export interface AllCompletions_completionsPaginated_edges {
  __typename: "completionEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: AllCompletions_completionsPaginated_edges_node | null
}

export interface AllCompletions_completionsPaginated {
  __typename: "completionConnection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: AllCompletions_completionsPaginated_pageInfo
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges: (AllCompletions_completionsPaginated_edges | null)[] | null
}

export interface AllCompletions {
  completionsPaginated: AllCompletions_completionsPaginated | null
}

export interface AllCompletionsVariables {
  course?: string | null
  cursor?: string | null
  completionLanguage?: string | null
}
