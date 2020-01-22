/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllModules
// ====================================================

export interface AllModules_study_modules {
  __typename: "StudyModule";
  id: any;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  order: number | null;
}

export interface AllModules {
  study_modules: AllModules_study_modules[];
}

export interface AllModulesVariables {
  language?: string | null;
}
