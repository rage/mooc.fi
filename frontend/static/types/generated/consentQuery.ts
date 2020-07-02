/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: consentQuery
// ====================================================

export interface consentQuery_currentUser {
  __typename: "User"
  id: string
  research_consent: boolean | null
}

export interface consentQuery {
  currentUser: consentQuery_currentUser | null
}
