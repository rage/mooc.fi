/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CourseStatus {
  Active = "Active",
  Ended = "Ended",
  Upcoming = "Upcoming",
}

export interface CompletionCreateManyWithoutUserInput {
  connect?: CompletionWhereUniqueInput[] | null
  create?: CompletionCreateWithoutUserInput[] | null
}

export interface CompletionCreateOneWithoutCompletions_registeredInput {
  connect?: CompletionWhereUniqueInput | null
  create?: CompletionCreateWithoutCompletions_registeredInput | null
}

export interface CompletionCreateWithoutCompletions_registeredInput {
  completion_language?: string | null
  course: CourseCreateOneInput
  created_at?: any | null
  email: string
  id?: any | null
  student_number?: string | null
  updated_at?: any | null
  user: UserCreateOneWithoutCompletionsInput
  user_upstream_id?: number | null
}

export interface CompletionCreateWithoutUserInput {
  completion_language?: string | null
  completions_registered?: CompletionRegisteredCreateManyWithoutCompletionInput | null
  course: CourseCreateOneInput
  created_at?: any | null
  email: string
  id?: any | null
  student_number?: string | null
  updated_at?: any | null
  user_upstream_id?: number | null
}

export interface CompletionRegisteredCreateManyWithoutCompletionInput {
  connect?: CompletionRegisteredWhereUniqueInput[] | null
  create?: CompletionRegisteredCreateWithoutCompletionInput[] | null
}

export interface CompletionRegisteredCreateManyWithoutOrganizationInput {
  connect?: CompletionRegisteredWhereUniqueInput[] | null
  create?: CompletionRegisteredCreateWithoutOrganizationInput[] | null
}

export interface CompletionRegisteredCreateManyWithoutUserInput {
  connect?: CompletionRegisteredWhereUniqueInput[] | null
  create?: CompletionRegisteredCreateWithoutUserInput[] | null
}

export interface CompletionRegisteredCreateWithoutCompletionInput {
  course: CourseCreateOneInput
  created_at?: any | null
  id?: any | null
  organization?: OrganizationCreateOneWithoutCompletions_registeredInput | null
  real_student_number: string
  updated_at?: any | null
  user: UserCreateOneWithoutRegistered_completionsInput
}

export interface CompletionRegisteredCreateWithoutOrganizationInput {
  completion: CompletionCreateOneWithoutCompletions_registeredInput
  course: CourseCreateOneInput
  created_at?: any | null
  id?: any | null
  real_student_number: string
  updated_at?: any | null
  user: UserCreateOneWithoutRegistered_completionsInput
}

export interface CompletionRegisteredCreateWithoutUserInput {
  completion: CompletionCreateOneWithoutCompletions_registeredInput
  course: CourseCreateOneInput
  created_at?: any | null
  id?: any | null
  organization?: OrganizationCreateOneWithoutCompletions_registeredInput | null
  real_student_number: string
  updated_at?: any | null
}

export interface CompletionRegisteredWhereUniqueInput {
  id?: any | null
}

export interface CompletionWhereUniqueInput {
  id?: any | null
}

export interface CourseAliasCreateManyWithoutCourseInput {
  connect?: CourseAliasWhereUniqueInput[] | null
  create?: CourseAliasCreateWithoutCourseInput[] | null
}

export interface CourseAliasCreateWithoutCourseInput {
  course_code: string
  created_at?: any | null
  id?: any | null
  updated_at?: any | null
}

export interface CourseAliasWhereUniqueInput {
  course_code?: string | null
  id?: any | null
}

export interface CourseCreateInput {
  course_aliases?: CourseAliasCreateManyWithoutCourseInput | null
  course_translations?: CourseTranslationCreateManyWithoutCourseInput | null
  created_at?: any | null
  id?: any | null
  name: string
  photo?: ImageCreateOneInput | null
  promote?: boolean | null
  services?: ServiceCreateManyWithoutCoursesInput | null
  slug: string
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module?: StudyModuleCreateOneWithoutCoursesInput | null
  updated_at?: any | null
}

export interface CourseCreateManyWithoutServicesInput {
  connect?: CourseWhereUniqueInput[] | null
  create?: CourseCreateWithoutServicesInput[] | null
}

export interface CourseCreateOneInput {
  connect?: CourseWhereUniqueInput | null
  create?: CourseCreateInput | null
}

export interface CourseCreateOneWithoutCourse_translationsInput {
  connect?: CourseWhereUniqueInput | null
  create?: CourseCreateWithoutCourse_translationsInput | null
}

export interface CourseCreateWithoutCourse_translationsInput {
  course_aliases?: CourseAliasCreateManyWithoutCourseInput | null
  created_at?: any | null
  id?: any | null
  name: string
  photo?: ImageCreateOneInput | null
  promote?: boolean | null
  services?: ServiceCreateManyWithoutCoursesInput | null
  slug: string
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module?: StudyModuleCreateOneWithoutCoursesInput | null
  updated_at?: any | null
}

export interface CourseCreateWithoutServicesInput {
  course_aliases?: CourseAliasCreateManyWithoutCourseInput | null
  course_translations?: CourseTranslationCreateManyWithoutCourseInput | null
  created_at?: any | null
  id?: any | null
  name: string
  photo?: ImageCreateOneInput | null
  promote?: boolean | null
  slug: string
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module?: StudyModuleCreateOneWithoutCoursesInput | null
  updated_at?: any | null
}

export interface CourseTranslationCreateInput {
  course: CourseCreateOneWithoutCourse_translationsInput
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  link: string
  name: string
  updated_at?: any | null
}

export interface CourseTranslationCreateManyWithoutCourseInput {
  connect?: CourseTranslationWhereUniqueInput[] | null
  create?: CourseTranslationCreateWithoutCourseInput[] | null
}

export interface CourseTranslationCreateWithoutCourseInput {
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  link: string
  name: string
  updated_at?: any | null
}

export interface CourseTranslationWhereUniqueInput {
  id?: any | null
}

export interface CourseTranslationWithIdInput {
  course?: string | null
  description: string
  id?: string | null
  language: string
  link: string
  name: string
}

export interface CourseWhereUniqueInput {
  id?: any | null
  slug?: string | null
}

export interface ExerciseCompletionCreateManyWithoutExerciseInput {
  connect?: ExerciseCompletionWhereUniqueInput[] | null
  create?: ExerciseCompletionCreateWithoutExerciseInput[] | null
}

export interface ExerciseCompletionCreateManyWithoutUserInput {
  connect?: ExerciseCompletionWhereUniqueInput[] | null
  create?: ExerciseCompletionCreateWithoutUserInput[] | null
}

export interface ExerciseCompletionCreateWithoutExerciseInput {
  completed?: boolean | null
  created_at?: any | null
  id?: any | null
  n_points?: number | null
  required_actions?: string | null
  timestamp?: any | null
  updated_at?: any | null
  user: UserCreateOneWithoutExercise_completionsInput
}

export interface ExerciseCompletionCreateWithoutUserInput {
  completed?: boolean | null
  created_at?: any | null
  exercise: ExerciseCreateOneWithoutExerciseCompletionsInput
  id?: any | null
  n_points?: number | null
  required_actions?: string | null
  timestamp?: any | null
  updated_at?: any | null
}

export interface ExerciseCompletionWhereUniqueInput {
  id?: any | null
}

export interface ExerciseCreateManyWithoutServiceInput {
  connect?: ExerciseWhereUniqueInput[] | null
  create?: ExerciseCreateWithoutServiceInput[] | null
}

export interface ExerciseCreateOneWithoutExerciseCompletionsInput {
  connect?: ExerciseWhereUniqueInput | null
  create?: ExerciseCreateWithoutExerciseCompletionsInput | null
}

export interface ExerciseCreateWithoutExerciseCompletionsInput {
  course: CourseCreateOneInput
  created_at?: any | null
  custom_id: string
  deleted?: boolean | null
  id?: any | null
  max_points?: number | null
  name?: string | null
  part?: number | null
  section?: number | null
  service?: ServiceCreateOneWithoutExercisesInput | null
  timestamp?: any | null
  updated_at?: any | null
}

export interface ExerciseCreateWithoutServiceInput {
  course: CourseCreateOneInput
  created_at?: any | null
  custom_id: string
  deleted?: boolean | null
  ExerciseCompletions?: ExerciseCompletionCreateManyWithoutExerciseInput | null
  id?: any | null
  max_points?: number | null
  name?: string | null
  part?: number | null
  section?: number | null
  timestamp?: any | null
  updated_at?: any | null
}

export interface ExerciseWhereUniqueInput {
  id?: any | null
}

export interface ImageCreateInput {
  compressed?: string | null
  compressed_mimetype?: string | null
  created_at?: any | null
  default?: boolean | null
  encoding?: string | null
  id?: any | null
  name?: string | null
  original: string
  original_mimetype: string
  uncompressed: string
  uncompressed_mimetype: string
  updated_at?: any | null
}

export interface ImageCreateOneInput {
  connect?: ImageWhereUniqueInput | null
  create?: ImageCreateInput | null
}

export interface ImageWhereUniqueInput {
  id?: any | null
}

export interface OrganizationCreateManyWithoutCreatorInput {
  connect?: OrganizationWhereUniqueInput[] | null
  create?: OrganizationCreateWithoutCreatorInput[] | null
}

export interface OrganizationCreateOneWithoutCompletions_registeredInput {
  connect?: OrganizationWhereUniqueInput | null
  create?: OrganizationCreateWithoutCompletions_registeredInput | null
}

export interface OrganizationCreateWithoutCompletions_registeredInput {
  contact_information?: string | null
  created_at?: any | null
  creator?: UserCreateOneWithoutCreated_organizationsInput | null
  disabled?: boolean | null
  email?: string | null
  hidden?: boolean | null
  id?: any | null
  logo_content_type?: string | null
  logo_file_name?: string | null
  logo_file_size?: number | null
  logo_updated_at?: any | null
  organization_translations?: OrganizationTranslationCreateManyWithoutOrganizationInput | null
  phone?: string | null
  pinned?: boolean | null
  secret_key: string
  slug: string
  tmc_created_at?: any | null
  tmc_updated_at?: any | null
  updated_at?: any | null
  verified?: boolean | null
  verified_at?: any | null
  website?: string | null
}

export interface OrganizationCreateWithoutCreatorInput {
  completions_registered?: CompletionRegisteredCreateManyWithoutOrganizationInput | null
  contact_information?: string | null
  created_at?: any | null
  disabled?: boolean | null
  email?: string | null
  hidden?: boolean | null
  id?: any | null
  logo_content_type?: string | null
  logo_file_name?: string | null
  logo_file_size?: number | null
  logo_updated_at?: any | null
  organization_translations?: OrganizationTranslationCreateManyWithoutOrganizationInput | null
  phone?: string | null
  pinned?: boolean | null
  secret_key: string
  slug: string
  tmc_created_at?: any | null
  tmc_updated_at?: any | null
  updated_at?: any | null
  verified?: boolean | null
  verified_at?: any | null
  website?: string | null
}

export interface OrganizationTranslationCreateManyWithoutOrganizationInput {
  connect?: OrganizationTranslationWhereUniqueInput[] | null
  create?: OrganizationTranslationCreateWithoutOrganizationInput[] | null
}

export interface OrganizationTranslationCreateWithoutOrganizationInput {
  created_at?: any | null
  disabled_reason?: string | null
  id?: any | null
  information?: string | null
  language: string
  name: string
  updated_at?: any | null
}

export interface OrganizationTranslationWhereUniqueInput {
  id?: any | null
}

export interface OrganizationWhereUniqueInput {
  id?: any | null
  secret_key?: string | null
  slug?: string | null
}

export interface ServiceCreateManyWithoutCoursesInput {
  connect?: ServiceWhereUniqueInput[] | null
  create?: ServiceCreateWithoutCoursesInput[] | null
}

export interface ServiceCreateOneWithoutExercisesInput {
  connect?: ServiceWhereUniqueInput | null
  create?: ServiceCreateWithoutExercisesInput | null
}

export interface ServiceCreateWithoutCoursesInput {
  created_at?: any | null
  exercises?: ExerciseCreateManyWithoutServiceInput | null
  id?: any | null
  name: string
  updated_at?: any | null
  url: string
}

export interface ServiceCreateWithoutExercisesInput {
  courses?: CourseCreateManyWithoutServicesInput | null
  created_at?: any | null
  id?: any | null
  name: string
  updated_at?: any | null
  url: string
}

export interface ServiceWhereUniqueInput {
  id?: any | null
}

export interface StudyModuleCreateOneWithoutCoursesInput {
  connect?: StudyModuleWhereUniqueInput | null
  create?: StudyModuleCreateWithoutCoursesInput | null
}

export interface StudyModuleCreateWithoutCoursesInput {
  created_at?: any | null
  id?: any | null
  study_module_translations?: StudyModuleTranslationCreateManyWithoutStudy_moduleInput | null
  updated_at?: any | null
}

export interface StudyModuleTranslationCreateManyWithoutStudy_moduleInput {
  connect?: StudyModuleTranslationWhereUniqueInput[] | null
  create?: StudyModuleTranslationCreateWithoutStudy_moduleInput[] | null
}

export interface StudyModuleTranslationCreateWithoutStudy_moduleInput {
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  name: string
  updated_at?: any | null
}

export interface StudyModuleTranslationWhereUniqueInput {
  id?: any | null
}

export interface StudyModuleWhereUniqueInput {
  id?: any | null
}

export interface UserCreateOneWithoutCompletionsInput {
  connect?: UserWhereUniqueInput | null
  create?: UserCreateWithoutCompletionsInput | null
}

export interface UserCreateOneWithoutCreated_organizationsInput {
  connect?: UserWhereUniqueInput | null
  create?: UserCreateWithoutCreated_organizationsInput | null
}

export interface UserCreateOneWithoutExercise_completionsInput {
  connect?: UserWhereUniqueInput | null
  create?: UserCreateWithoutExercise_completionsInput | null
}

export interface UserCreateOneWithoutRegistered_completionsInput {
  connect?: UserWhereUniqueInput | null
  create?: UserCreateWithoutRegistered_completionsInput | null
}

export interface UserCreateWithoutCompletionsInput {
  administrator: boolean
  created_at?: any | null
  created_organizations?: OrganizationCreateManyWithoutCreatorInput | null
  email: string
  exercise_completions?: ExerciseCompletionCreateManyWithoutUserInput | null
  first_name?: string | null
  id?: any | null
  last_name?: string | null
  real_student_number?: string | null
  registered_completions?: CompletionRegisteredCreateManyWithoutUserInput | null
  student_number?: string | null
  updated_at?: any | null
  upstream_id: number
  username: string
}

export interface UserCreateWithoutCreated_organizationsInput {
  administrator: boolean
  completions?: CompletionCreateManyWithoutUserInput | null
  created_at?: any | null
  email: string
  exercise_completions?: ExerciseCompletionCreateManyWithoutUserInput | null
  first_name?: string | null
  id?: any | null
  last_name?: string | null
  real_student_number?: string | null
  registered_completions?: CompletionRegisteredCreateManyWithoutUserInput | null
  student_number?: string | null
  updated_at?: any | null
  upstream_id: number
  username: string
}

export interface UserCreateWithoutExercise_completionsInput {
  administrator: boolean
  completions?: CompletionCreateManyWithoutUserInput | null
  created_at?: any | null
  created_organizations?: OrganizationCreateManyWithoutCreatorInput | null
  email: string
  first_name?: string | null
  id?: any | null
  last_name?: string | null
  real_student_number?: string | null
  registered_completions?: CompletionRegisteredCreateManyWithoutUserInput | null
  student_number?: string | null
  updated_at?: any | null
  upstream_id: number
  username: string
}

export interface UserCreateWithoutRegistered_completionsInput {
  administrator: boolean
  completions?: CompletionCreateManyWithoutUserInput | null
  created_at?: any | null
  created_organizations?: OrganizationCreateManyWithoutCreatorInput | null
  email: string
  exercise_completions?: ExerciseCompletionCreateManyWithoutUserInput | null
  first_name?: string | null
  id?: any | null
  last_name?: string | null
  real_student_number?: string | null
  student_number?: string | null
  updated_at?: any | null
  upstream_id: number
  username: string
}

export interface UserWhereUniqueInput {
  id?: any | null
  upstream_id?: number | null
  username?: string | null
}

//==============================================================
// END Enums and Input Objects
//==============================================================
