/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export const EditorCourseOtherCoursesFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EditorCourseOtherCoursesFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"course_translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseTranslationCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseKeyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseKeyFields"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseTranslationCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CourseTranslation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<Types.EditorCourseOtherCoursesFieldsFragment, unknown>;