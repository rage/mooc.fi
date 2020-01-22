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
  id: any;
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
}

export interface AllCompletions_completionsPaginated_edges_node_course {
  __typename: "Course";
  id: any;
  name: string;
}

export interface AllCompletions_completionsPaginated_edges_node_completions_registered_organization {
  __typename: "Organization";
  id: any;
  slug: string;
}

export interface AllCompletions_completionsPaginated_edges_node_completions_registered {
  __typename: "CompletionRegistered";
  id: any;
  organization: AllCompletions_completionsPaginated_edges_node_completions_registered_organization | null;
}

export interface AllCompletions_completionsPaginated_edges_node {
  __typename: "Completion";
  id: any;
  email: string;
  completion_language: string | null;
  created_at: any | null;
  user: AllCompletions_completionsPaginated_edges_node_user;
  course: AllCompletions_completionsPaginated_edges_node_course;
  completions_registered: AllCompletions_completionsPaginated_edges_node_completions_registered[] | null;
}

export interface AllCompletions_completionsPaginated_edges {
  __typename: "CompletionEdge";
  node: AllCompletions_completionsPaginated_edges_node;
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
  cursor?: string | null;
  completionLanguage?: string | null;
}
