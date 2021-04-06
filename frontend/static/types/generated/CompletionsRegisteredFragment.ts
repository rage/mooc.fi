/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CompletionsRegisteredFragment
// ====================================================

export interface CompletionsRegisteredFragment_completions_registered_organization {
  __typename: "Organization"
  slug: string
}

export interface CompletionsRegisteredFragment_completions_registered {
  __typename: "CompletionRegistered"
  id: string
  created_at: any | null
  organization: CompletionsRegisteredFragment_completions_registered_organization | null
}

export interface CompletionsRegisteredFragment {
  __typename: "Completion"
  completions_registered: CompletionsRegisteredFragment_completions_registered[]
}
