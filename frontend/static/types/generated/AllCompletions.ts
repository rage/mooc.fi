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
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
  student_number: string | null
}

export interface AllCompletions_completionsPaginated_edges_node_course {
  __typename: "Course"
  id: string
  name: string
}

export interface AllCompletions_completionsPaginated_edges_node_completions_registered_organization {
  __typename: "Organization"
  id: string
  slug: string
}

export interface AllCompletions_completionsPaginated_edges_node_completions_registered {
  __typename: "CompletionRegistered"
  id: string
  organization: AllCompletions_completionsPaginated_edges_node_completions_registered_organization | null
}

export interface AllCompletions_completionsPaginated_edges_node {
  __typename: "Completion"
  id: string
  email: string
  completion_language: string | null
  created_at: any | null
  user: AllCompletions_completionsPaginated_edges_node_user | null
  course: AllCompletions_completionsPaginated_edges_node_course | null
  completions_registered: AllCompletions_completionsPaginated_edges_node_completions_registered[]
}

export interface AllCompletions_completionsPaginated_edges {
  __typename: "CompletionEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: AllCompletions_completionsPaginated_edges_node | null
}

export interface AllCompletions_completionsPaginated {
  __typename: "CompletionConnection"
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
  course: string
  cursor?: string | null
  completionLanguage?: string | null
  search?: string | null
}
