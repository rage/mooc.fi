/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export const CompletionDetailedFieldsWithCourseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionDetailedFieldsWithCourse"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionDetailedFields"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionCourseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"completion_link"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"project_completion"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionCourseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"has_certificate"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionDetailedFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionRegisteredCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificate_availability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CertificateAvailabilityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CertificateAvailabilityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateAvailability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed_course"}},{"kind":"Field","name":{"kind":"Name","value":"existing_certificate"}},{"kind":"Field","name":{"kind":"Name","value":"honors"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionRegisteredCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CompletionRegistered"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseKeyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseKeyFields"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<Types.CompletionDetailedFieldsWithCourseFragment, unknown>;