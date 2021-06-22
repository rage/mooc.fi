/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConnectedUser
// ====================================================

export interface ConnectedUser_currentUser_verified_users_organization_organization_translations {
  __typename: "OrganizationTranslation";
  language: string;
  name: string;
}

export interface ConnectedUser_currentUser_verified_users_organization {
  __typename: "Organization";
  id: string;
  organization_translations: ConnectedUser_currentUser_verified_users_organization_organization_translations[];
}

export interface ConnectedUser_currentUser_verified_users {
  __typename: "VerifiedUser";
  id: string;
  created_at: any | null;
  updated_at: any | null;
  display_name: string | null;
  organization: ConnectedUser_currentUser_verified_users_organization | null;
}

export interface ConnectedUser_currentUser {
  __typename: "User";
  id: string;
  upstream_id: number;
  verified_users: ConnectedUser_currentUser_verified_users[];
}

export interface ConnectedUser {
  currentUser: ConnectedUser_currentUser | null;
}
