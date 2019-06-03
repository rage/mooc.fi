/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCompletions
// ====================================================

export interface AllCompletions_completionsPaginated_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface AllCompletions_completionsPaginated_edges_node_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
}

export interface AllCompletions_completionsPaginated_edges_node {
  __typename: "Completion";
  id: any;
  email: string;
  completion_language: string | null;
  created_at: any | null;
  user: AllCompletions_completionsPaginated_edges_node_user;
}

export interface AllCompletions_completionsPaginated_edges {
  __typename: "CompletionEdge";
  node: AllCompletions_completionsPaginated_edges_node;
  cursor: string;
}

export interface AllCompletions_completionsPaginated {
  __typename: "CompletionConnection";
  pageInfo: AllCompletions_completionsPaginated_pageInfo;
  edges: AllCompletions_completionsPaginated_edges[];
}

export interface AllCompletions {
  completionsPaginated: AllCompletions_completionsPaginated;
}

export interface AllCompletionsVariables {
  course?: string | null;
}
