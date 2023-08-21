/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export const TagEditorTagTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TagEditorTagTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagTypeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagTypeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TagType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<Types.TagEditorTagTypesQuery, Types.TagEditorTagTypesQueryVariables>;