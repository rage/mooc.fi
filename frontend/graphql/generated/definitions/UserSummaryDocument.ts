/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export const UserSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeNoPointsAwardedExercises"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeletedExercises"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upstream_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upstream_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserDetailedFields"}},{"kind":"Field","name":{"kind":"Name","value":"user_course_summary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeNoPointsAwardedExercises"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeNoPointsAwardedExercises"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeletedExercises"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeletedExercises"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSummaryCoreFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"completion_language"}},{"kind":"Field","name":{"kind":"Name","value":"completion_link"}},{"kind":"Field","name":{"kind":"Name","value":"completion_date"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"eligible_for_ects"}},{"kind":"Field","name":{"kind":"Name","value":"project_completion"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionDetailedFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Completion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"completions_registered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionRegisteredCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificate_availability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CertificateAvailabilityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CertificateAvailabilityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateAvailability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed_course"}},{"kind":"Field","name":{"kind":"Name","value":"existing_certificate"}},{"kind":"Field","name":{"kind":"Name","value":"honors"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CompletionRegisteredCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CompletionRegistered"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"completion_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization_id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseKeyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseKeyFields"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"photo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"custom_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"part"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseCompletion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"attempted"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completion_required_actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completion_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"original_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"compressed"}},{"kind":"Field","name":{"kind":"Name","value":"compressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed"}},{"kind":"Field","name":{"kind":"Name","value":"uncompressed_mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressExtraFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressExtra"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierInfoFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierProgressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"projectCompletion"}},{"kind":"Field","name":{"kind":"Name","value":"highestTier"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"pointsNeeded"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"pointsNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCompletionsNeeded"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TierInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"hasTier"}},{"kind":"Field","name":{"kind":"Name","value":"missingFromTier"}},{"kind":"Field","name":{"kind":"Name","value":"requiredByTier"}},{"kind":"Field","name":{"kind":"Name","value":"exercisePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierProgressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TierProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise_number"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"custom_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_id"}},{"kind":"Field","name":{"kind":"Name","value":"service_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierProgressExerciseCompletionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierProgressExerciseCompletionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseCompletion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointsByGroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointsByGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"real_student_number"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserDetailedFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"research_consent"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"points_by_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointsByGroupFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extra"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressExtraFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_count"}},{"kind":"Field","name":{"kind":"Name","value":"exercises_completed_count"}},{"kind":"Field","name":{"kind":"Name","value":"exercises_attempted_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseServiceProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"service_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"points_by_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointsByGroupFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseSummaryCourseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseWithPhotoCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"has_certificate"}},{"kind":"Field","name":{"kind":"Name","value":"points_needed"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions_needed"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeletedExercises"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeNoPointsAwarded"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeNoPointsAwardedExercises"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseSummaryCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSummaryCourseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeDeletedExercises"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeletedExercises"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseProgressCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_service_progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CompletionDetailedFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"tier_summaries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserTierCourseSummaryCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserTierCourseSummaryCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSummaryCourseFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseProgressCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_service_progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}}]}}]} as unknown as DocumentNode<Types.UserSummaryQuery, Types.UserSummaryQueryVariables>;