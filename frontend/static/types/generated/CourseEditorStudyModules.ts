/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseEditorStudyModules
// ====================================================

export interface CourseEditorStudyModules_study_modules {
  __typename: "StudyModule";
  id: string;
  name: string;
  slug: string;
}

export interface CourseEditorStudyModules {
  study_modules: (CourseEditorStudyModules_study_modules | null)[] | null;
}
