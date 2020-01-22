/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCompletionsPrevious
// ====================================================

export interface AllCompletionsPrevious_completionsPaginated_pageInfo {
  __typename: "PageInfo"
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_user {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  student_number: string | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_course {
  __typename: "Course"
  id: any
  name: string
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered_organization {
  __typename: "Organization"
  id: any
  slug: string
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered {
  __typename: "CompletionRegistered"
  id: any
  organization: AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered_organization | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges_node {
  __typename: "Completion"
  id: any
  email: string
  completion_language: string | null
  created_at: any | null
  user: AllCompletionsPrevious_completionsPaginated_edges_node_user
  course: AllCompletionsPrevious_completionsPaginated_edges_node_course
  completions_registered:
    | AllCompletionsPrevious_completionsPaginated_edges_node_completions_registered[]
    | null
}

export interface AllCompletionsPrevious_completionsPaginated_edges {
  __typename: "CompletionEdge"
  node: AllCompletionsPrevious_completionsPaginated_edges_node
}

export interface AllCompletionsPrevious_completionsPaginated {
  __typename: "CompletionConnection"
  pageInfo: AllCompletionsPrevious_completionsPaginated_pageInfo
  edges: AllCompletionsPrevious_completionsPaginated_edges[]
}

export interface AllCompletionsPrevious {
  completionsPaginated: AllCompletionsPrevious_completionsPaginated
}

export interface AllCompletionsPreviousVariables {
  course?: string | null
  cursor?: string | null
  completionLanguage?: string | null
}
