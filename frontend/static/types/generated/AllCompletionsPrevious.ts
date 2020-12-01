/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCompletionsPrevious
// ====================================================

export interface AllCompletionsPrevious_completionsPaginated_pageInfo {
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

export interface AllCompletionsPrevious_completionsPaginated_edges_node_user {
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
  student_number: string | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_course {
  __typename: "Course"
  id: string
  name: string
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered_organization {
  __typename: "Organization"
  id: string
  slug: string
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered {
  __typename: "CompletionRegistered"
  id: string
  organization: AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered_organization | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node {
  __typename: "Completion"
  id: string
  email: string
  completion_language: string | null
  created_at: any | null
  user: AllCompletionsPrevious_completionsPaginated_edges_node_user | null
  course: AllCompletionsPrevious_completionsPaginated_edges_node_course | null
  completions_registered: AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered[]
}

export interface AllCompletionsPrevious_completionsPaginated_edges {
  __typename: "CompletionEdge"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: AllCompletionsPrevious_completionsPaginated_edges_node | null
}

export interface AllCompletionsPrevious_completionsPaginated {
  __typename: "CompletionConnection"
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: AllCompletionsPrevious_completionsPaginated_pageInfo
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges: (AllCompletionsPrevious_completionsPaginated_edges | null)[] | null
}

export interface AllCompletionsPrevious {
  completionsPaginated: AllCompletionsPrevious_completionsPaginated | null
}

export interface AllCompletionsPreviousVariables {
  course: string
  cursor?: string | null
  completionLanguage?: string | null
  search?: string | null
}
