/* tslint:disable */

/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.
import { ManualCompletionArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: AddManualCompletion
// ====================================================

export interface AddManualCompletion_addManualCompletion_user {
  __typename: "User"
  upstream_id: number
  username: string
  email: string
}

export interface AddManualCompletion_addManualCompletion {
  __typename: "Completion"
  id: string
  created_at: any | null
  updated_at: any | null
  completion_language: string | null
  grade: string | null
  user: AddManualCompletion_addManualCompletion_user | null
}

export interface AddManualCompletion {
  addManualCompletion: (AddManualCompletion_addManualCompletion | null)[] | null
}

export interface AddManualCompletionVariables {
  course_id: string
  completions?: ManualCompletionArg[] | null
}
