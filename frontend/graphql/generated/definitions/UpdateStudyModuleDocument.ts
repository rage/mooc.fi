/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export const UpdateStudyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStudyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModuleUpsertArg"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStudyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"study_module"},"value":{"kind":"Variable","name":{"kind":"Name","value":"study_module"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudyModuleDetailedFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudyModuleKeyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudyModuleCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudyModuleKeyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudyModuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudyModuleCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudyModuleTranslationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModuleTranslation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudyModuleDetailedFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudyModule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudyModuleFields"}},{"kind":"Field","name":{"kind":"Name","value":"study_module_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudyModuleTranslationFields"}}]}}]}}]} as unknown as DocumentNode<Types.UpdateStudyModuleMutation, Types.UpdateStudyModuleMutationVariables>;