/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MoreCompletions
// ====================================================

export interface MoreCompletions_completionsPaginated_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface MoreCompletions_completionsPaginated_edges_node_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
}

export interface MoreCompletions_completionsPaginated_edges_node {
  __typename: "Completion";
  id: any;
  email: string;
  completion_language: string | null;
  created_at: any | null;
  user: MoreCompletions_completionsPaginated_edges_node_user;
}

export interface MoreCompletions_completionsPaginated_edges {
  __typename: "CompletionEdge";
  node: MoreCompletions_completionsPaginated_edges_node;
  cursor: string;
}

export interface MoreCompletions_completionsPaginated {
  __typename: "CompletionConnection";
  pageInfo: MoreCompletions_completionsPaginated_pageInfo;
  edges: MoreCompletions_completionsPaginated_edges[];
}

export interface MoreCompletions {
  completionsPaginated: MoreCompletions_completionsPaginated;
}

export interface MoreCompletionsVariables {
  course?: string | null;
  cursor?: string | null;
}
