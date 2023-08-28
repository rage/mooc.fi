/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export const UserCourseServiceProgressCoreFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseServiceProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"service_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"points_by_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointsByGroupFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointsByGroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointsByGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}}]} as unknown as DocumentNode<Types.UserCourseServiceProgressCoreFieldsFragment, unknown>;