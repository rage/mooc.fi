/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEditorModulesWithTranslations
// ====================================================

export interface AllEditorModulesWithTranslations_study_modules_study_module_translations {
  __typename: "StudyModuleTranslation";
  id: any;
  language: string;
  name: string;
  description: string;
}

export interface AllEditorModulesWithTranslations_study_modules {
  __typename: "StudyModule";
  id: any;
  slug: string;
  name: string;
  image: string | null;
  order: number | null;
  study_module_translations: AllEditorModulesWithTranslations_study_modules_study_module_translations[] | null;
}

export interface AllEditorModulesWithTranslations {
  study_modules: AllEditorModulesWithTranslations_study_modules[];
}
