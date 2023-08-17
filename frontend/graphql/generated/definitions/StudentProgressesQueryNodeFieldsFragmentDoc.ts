/* eslint-disable */
import * as Types from "../types"

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export const StudentProgressesQueryNodeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentProgressesQueryNodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSetting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseSettingCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressCoreFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseKeyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Course"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseKeyFields"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ects"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseCompletion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"attempted"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completion_required_actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completion_id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseProgressCoreFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_course_service_progresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressExtraFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressExtra"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierInfoFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierProgressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"projectCompletion"}},{"kind":"Field","name":{"kind":"Name","value":"highestTier"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"pointsNeeded"}},{"kind":"Field","name":{"kind":"Name","value":"pointsPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"pointsNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"totalExerciseCompletionsNeeded"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TierInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"hasTier"}},{"kind":"Field","name":{"kind":"Name","value":"missingFromTier"}},{"kind":"Field","name":{"kind":"Name","value":"requiredByTier"}},{"kind":"Field","name":{"kind":"Name","value":"exercisePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exercisesNeededPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierProgressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TierProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise_number"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"custom_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_id"}},{"kind":"Field","name":{"kind":"Name","value":"service_id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TierProgressExerciseCompletionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TierProgressExerciseCompletionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseCompletion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseCompletionCoreFields"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointsByGroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointsByGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upstream_id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"student_number"}},{"kind":"Field","name":{"kind":"Name","value":"real_student_number"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"max_points"}},{"kind":"Field","name":{"kind":"Name","value":"n_points"}},{"kind":"Field","name":{"kind":"Name","value":"points_by_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointsByGroupFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"extra"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressExtraFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise_progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"}},{"kind":"Field","name":{"kind":"Name","value":"exercise_count"}},{"kind":"Field","name":{"kind":"Name","value":"exercises_completed_count"}},{"kind":"Field","name":{"kind":"Name","value":"exercises_attempted_count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseServiceProgressCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseServiceProgress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"service_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"points_by_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointsByGroupFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCourseSettingCoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserCourseSetting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"course_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<Types.StudentProgressesQueryNodeFieldsFragment, unknown>;