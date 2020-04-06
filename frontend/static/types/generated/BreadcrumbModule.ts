/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BreadcrumbModule
// ====================================================

export interface BreadcrumbModule_study_module_study_module_translations {
  __typename: "StudyModuleTranslation";
  id: any;
  language: string;
  name: string;
}

export interface BreadcrumbModule_study_module {
  __typename: "StudyModule";
  id: any;
  slug: string;
  name: string;
  study_module_translations: BreadcrumbModule_study_module_study_module_translations[] | null;
}

export interface BreadcrumbModule {
  study_module: BreadcrumbModule_study_module | null;
}

export interface BreadcrumbModuleVariables {
  slug?: string | null;
}
