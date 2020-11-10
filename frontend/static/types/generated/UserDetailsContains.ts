/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserDetailsContains
// ====================================================

export interface UserDetailsContains_userDetailsContains_pageInfo {
  __typename: "PageInfo";
  /**
   * The cursor corresponding to the first nodes in edges. Null if the connection is empty.
   */
  startCursor: string | null;
  /**
   * The cursor corresponding to the last nodes in edges. Null if the connection is empty.
   */
  endCursor: string | null;
  /**
   * Used to indicate whether more edges exist following the set defined by the clients arguments.
   */
  hasNextPage: boolean;
  /**
   * Used to indicate whether more edges exist prior to the set defined by the clients arguments.
   */
  hasPreviousPage: boolean;
}

export interface UserDetailsContains_userDetailsContains_edges_node {
  __typename: "User";
  id: string;
  email: string;
  student_number: string | null;
  real_student_number: string | null;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
}

export interface UserDetailsContains_userDetailsContains_edges {
  __typename: "UserEdge";
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Node
   */
  node: UserDetailsContains_userDetailsContains_edges_node | null;
}

export interface UserDetailsContains_userDetailsContains {
  __typename: "QueryUserDetailsContains_Connection";
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
   */
  pageInfo: UserDetailsContains_userDetailsContains_pageInfo;
  /**
   * https: // facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
   */
  edges: (UserDetailsContains_userDetailsContains_edges | null)[] | null;
  count: number | null;
}

export interface UserDetailsContains {
  userDetailsContains: UserDetailsContains_userDetailsContains | null;
}

export interface UserDetailsContainsVariables {
  search: string;
  first?: number | null;
  last?: number | null;
  before?: string | null;
  after?: string | null;
  skip?: number | null;
}
